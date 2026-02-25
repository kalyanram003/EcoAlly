"""
train.py — Two-Phase Fine-tuning for EcoLens
=============================================
Phase 1 (5 epochs):  Train classifier head only — fast, no overfitting risk
Phase 2 (10 epochs): Unfreeze last conv blocks — squeeze extra accuracy

DATASET STRUCTURE:
  data/eco_images/
    plant/
    water_body/
    waste/
    wildlife/
    urban_green/
    irrelevant/
"""

import os
import json

import torch
import torch.nn as nn
import torch.optim as optim
from torch.optim.lr_scheduler import CosineAnnealingLR
from torch.utils.data import DataLoader, random_split
from torchvision import datasets, models, transforms

DATA_DIR = "data/eco_images"
OUTPUT_DIR = "model/weights"
NUM_CLASSES = 6
BATCH_SIZE = 32
VAL_SPLIT = 0.20
EPOCHS_P1 = 5
LR_P1 = 1e-3
EPOCHS_P2 = 10
LR_P2 = 1e-5
EARLY_STOP = 4

transform_p1 = transforms.Compose(
    [
        transforms.RandomResizedCrop(224, scale=(0.8, 1.0)),
        transforms.RandomHorizontalFlip(p=0.5),
        transforms.ColorJitter(
            brightness=0.2, contrast=0.2, saturation=0.2
        ),
        transforms.ToTensor(),
        transforms.Normalize(
            [0.485, 0.456, 0.406],
            [0.229, 0.224, 0.225],
        ),
    ]
)

transform_p2 = transforms.Compose(
    [
        transforms.RandomResizedCrop(224, scale=(0.6, 1.0)),
        transforms.RandomHorizontalFlip(p=0.5),
        transforms.RandomRotation(15),
        transforms.ColorJitter(
            brightness=0.3, contrast=0.3, saturation=0.3, hue=0.05
        ),
        transforms.RandomAffine(degrees=0, translate=(0.1, 0.1)),
        transforms.ToTensor(),
        transforms.Normalize(
            [0.485, 0.456, 0.406],
            [0.229, 0.224, 0.225],
        ),
    ]
)

transform_val = transforms.Compose(
    [
        transforms.Resize(256),
        transforms.CenterCrop(224),
        transforms.ToTensor(),
        transforms.Normalize(
            [0.485, 0.456, 0.406],
            [0.229, 0.224, 0.225],
        ),
    ]
)


def build_loaders(transform_train):
    full_ds = datasets.ImageFolder(DATA_DIR, transform=transform_train)
    val_size = int(len(full_ds) * VAL_SPLIT)
    train_size = len(full_ds) - val_size
    train_ds, val_ds = random_split(full_ds, [train_size, val_size])
    val_ds.dataset = datasets.ImageFolder(DATA_DIR, transform=transform_val)

    train_loader = DataLoader(
        train_ds,
        batch_size=BATCH_SIZE,
        shuffle=True,
        num_workers=4,
        pin_memory=True,
    )
    val_loader = DataLoader(
        val_ds,
        batch_size=BATCH_SIZE,
        shuffle=False,
        num_workers=4,
        pin_memory=True,
    )
    return train_loader, val_loader, full_ds.class_to_idx


def run_epoch(model, loader, criterion, optimizer, device, training: bool):
    model.train() if training else model.eval()
    total_loss, correct, total = 0.0, 0, 0
    with torch.set_grad_enabled(training):
        for imgs, labels in loader:
            imgs, labels = imgs.to(device), labels.to(device)
            if training:
                optimizer.zero_grad()
            outputs = model(imgs)
            loss = criterion(outputs, labels)
            if training:
                loss.backward()
                optimizer.step()
            total_loss += loss.item()
            _, predicted = outputs.max(1)
            total += labels.size(0)
            correct += predicted.eq(labels).sum().item()
    return total_loss / len(loader), 100.0 * correct / total


def main():
    if not os.path.exists(DATA_DIR):
        print(f"[ERROR] Dataset not found at '{DATA_DIR}'. See docstring for setup.")
        return

    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    os.makedirs(OUTPUT_DIR, exist_ok=True)

    train_loader, val_loader, class_to_idx = build_loaders(transform_p1)
    print(f"[Train] Classes: {list(class_to_idx.keys())}")
    print(
        f"[Train] {len(train_loader.dataset)} train | "
        f"{len(val_loader.dataset)} val | device: {device}\n"
    )

    model = models.mobilenet_v2(
        weights=models.MobileNet_V2_Weights.IMAGENET1K_V1
    )
    for param in model.parameters():
        param.requires_grad = False
    in_features = model.classifier[1].in_features
    model.classifier = nn.Sequential(
        nn.Dropout(p=0.3),
        nn.Linear(in_features, NUM_CLASSES),
    )
    model = model.to(device)

    criterion = nn.CrossEntropyLoss()
    best_val_acc = 0.0

    print("=" * 55)
    print("PHASE 1: Classifier head only (backbone frozen)")
    print("=" * 55)
    opt_p1 = optim.Adam(model.classifier.parameters(), lr=LR_P1)

    for epoch in range(EPOCHS_P1):
        tr_loss, tr_acc = run_epoch(
            model, train_loader, criterion, opt_p1, device, True
        )
        _, va_acc = run_epoch(
            model, val_loader, criterion, opt_p1, device, False
        )
        print(
            f"  Epoch {epoch+1:02d}/{EPOCHS_P1} | Loss: {tr_loss:.4f} | "
            f"Train: {tr_acc:.1f}% | Val: {va_acc:.1f}%"
        )
        if va_acc > best_val_acc:
            best_val_acc = va_acc
            torch.save(
                model.state_dict(),
                f"{OUTPUT_DIR}/ecolens_phase1_best.pth",
            )
            print(f"  ✓ Phase 1 best saved ({va_acc:.2f}%)")

    print("\n" + "=" * 55)
    print("PHASE 2: Fine-tuning last conv blocks + classifier")
    print("=" * 55)

    all_params = list(model.parameters())
    for p in all_params[:-20]:
        p.requires_grad = False
    for p in all_params[-20:]:
        p.requires_grad = True

    train_loader, val_loader, _ = build_loaders(transform_p2)
    opt_p2 = optim.Adam(
        filter(lambda p: p.requires_grad, model.parameters()),
        lr=LR_P2,
        weight_decay=1e-4,
    )
    scheduler = CosineAnnealingLR(opt_p2, T_max=EPOCHS_P2, eta_min=1e-7)
    patience = 0

    for epoch in range(EPOCHS_P2):
        tr_loss, tr_acc = run_epoch(
            model, train_loader, criterion, opt_p2, device, True
        )
        _, va_acc = run_epoch(
            model, val_loader, criterion, opt_p2, device, False
        )
        scheduler.step()
        print(
            f"  Epoch {epoch+1:02d}/{EPOCHS_P2} | Loss: {tr_loss:.4f} | "
            f"Train: {tr_acc:.1f}% | Val: {va_acc:.1f}%"
        )
        if va_acc > best_val_acc:
            best_val_acc = va_acc
            patience = 0
            torch.save(
                model.state_dict(),
                f"{OUTPUT_DIR}/ecolens_finetuned.pth",
            )
            print(f"  ✓ Best model saved ({va_acc:.2f}%)")
        else:
            patience += 1
            if patience >= EARLY_STOP:
                print(f"  ⏹ Early stopping ({EARLY_STOP} epochs no improvement)")
                break

    with open(f"{OUTPUT_DIR}/class_mapping.json", "w") as f:
        json.dump({v: k for k, v in class_to_idx.items()}, f, indent=2)

    print(f"\n✅ Done! Best val accuracy: {best_val_acc:.2f}%")
    print(f"   Weights : {OUTPUT_DIR}/ecolens_finetuned.pth")
    print(
        "   Start   : uvicorn main:app --host 0.0.0.0 --port 5000 --reload"
    )


if __name__ == "__main__":
    main()
