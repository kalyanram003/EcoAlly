import os

import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import DataLoader
from torchvision import models, transforms, datasets


# ── Config ────────────────────────────────────────────────────────────────────
DATA_DIR = "data/eco_images"   # Folder structure: data/eco_images/plant/ data/eco_images/waste/ etc.
EPOCHS = 10
BATCH_SIZE = 32
LEARNING_RATE = 1e-4
NUM_CLASSES = 6  # plant, water_body, waste, wildlife, urban_green, irrelevant


# ── Transforms ────────────────────────────────────────────────────────────────
train_transform = transforms.Compose([
    transforms.RandomResizedCrop(224),
    transforms.RandomHorizontalFlip(),
    transforms.ColorJitter(brightness=0.2, contrast=0.2),
    transforms.ToTensor(),
    transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
])


# ── Dataset ───────────────────────────────────────────────────────────────────
dataset = datasets.ImageFolder(DATA_DIR, transform=train_transform)
loader = DataLoader(dataset, batch_size=BATCH_SIZE, shuffle=True, num_workers=4)


# ── Model ─────────────────────────────────────────────────────────────────────
model = models.mobilenet_v2(weights=models.MobileNet_V2_Weights.IMAGENET1K_V1)

# Freeze all layers except the last block + classifier
for param in list(model.parameters())[:-20]:
    param.requires_grad = False

in_features = model.classifier[1].in_features
model.classifier = nn.Sequential(
    nn.Dropout(p=0.3),
    nn.Linear(in_features, NUM_CLASSES)
)

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model = model.to(device)


# ── Training ──────────────────────────────────────────────────────────────────
criterion = nn.CrossEntropyLoss()
optimizer = optim.Adam(
    filter(lambda p: p.requires_grad, model.parameters()),
    lr=LEARNING_RATE,
)

for epoch in range(EPOCHS):
    model.train()
    running_loss = 0.0
    correct = 0
    total = 0

    for images, labels in loader:
        images, labels = images.to(device), labels.to(device)
        optimizer.zero_grad()
        outputs = model(images)
        loss = criterion(outputs, labels)
        loss.backward()
        optimizer.step()

        running_loss += loss.item()
        _, predicted = outputs.max(1)
        total += labels.size(0)
        correct += predicted.eq(labels).sum().item()

    print(
        f"Epoch {epoch + 1}/{EPOCHS} | "
        f"Loss: {running_loss / len(loader):.4f} | "
        f"Acc: {100.0 * correct / total:.2f}%"
    )


# ── Save Fine-tuned Weights ───────────────────────────────────────────────────
os.makedirs("model/weights", exist_ok=True)
torch.save(model.state_dict(), "model/weights/ecolens_finetuned.pth")
print("✓ Fine-tuned model saved to model/weights/ecolens_finetuned.pth")

