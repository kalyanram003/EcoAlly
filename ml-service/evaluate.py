"""
evaluate.py — Per-category evaluation of fine-tuned EcoLens model
Run after train.py has completed.
Usage: python evaluate.py
"""

import os
import torch
import torch.nn as nn
from torchvision import datasets, models, transforms
from torch.utils.data import DataLoader, random_split
from sklearn.metrics import classification_report, confusion_matrix, accuracy_score
import matplotlib.pyplot as plt
import seaborn as sns

# ---------------- CONFIG ---------------- #
DATA_DIR = "data/eco_images"
WEIGHTS_PATH = "model/weights/ecolens_phase1_best.pth"
NUM_CLASSES = 2
VAL_SPLIT = 0.20
BATCH_SIZE = 32
SEED = 42

# ---------------- SAFETY CHECK ---------------- #
if not os.path.exists(WEIGHTS_PATH):
    print("❌ Model not found. Please run train.py first.")
    exit()

# ---------------- TRANSFORMS ---------------- #
transform_val = transforms.Compose([
    transforms.Resize(256),
    transforms.CenterCrop(224),
    transforms.ToTensor(),
    transforms.Normalize([0.485, 0.456, 0.406],
                         [0.229, 0.224, 0.225]),
])

# ---------------- DATASET ---------------- #
full_ds = datasets.ImageFolder(DATA_DIR, transform=transform_val)
class_names = full_ds.classes
print(f"Classes: {class_names}")

val_size = int(len(full_ds) * VAL_SPLIT)
train_size = len(full_ds) - val_size

# Reproducible split
generator = torch.Generator().manual_seed(SEED)
_, val_ds = random_split(full_ds, [train_size, val_size], generator=generator)

val_loader = DataLoader(val_ds, batch_size=BATCH_SIZE, shuffle=False)

# ---------------- MODEL ---------------- #
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

model = models.mobilenet_v2(weights=None)
in_features = model.classifier[1].in_features

model.classifier = nn.Sequential(
    nn.Dropout(p=0.3),
    nn.Linear(in_features, NUM_CLASSES),
)

model.load_state_dict(torch.load(WEIGHTS_PATH, map_location=device))
model.to(device)
model.eval()

# ---------------- EVALUATION ---------------- #
all_preds = []
all_labels = []

with torch.no_grad():
    for imgs, labels in val_loader:
        imgs = imgs.to(device)
        outputs = model(imgs)
        _, preds = outputs.max(1)

        all_preds.extend(preds.cpu().tolist())
        all_labels.extend(labels.tolist())

# ---------------- METRICS ---------------- #
print("\n=== Per-Category Classification Report ===\n")
print(classification_report(all_labels, all_preds,
      target_names=class_names, digits=4))

acc = accuracy_score(all_labels, all_preds)
print(f"\nOverall Accuracy: {acc * 100:.2f}%")

# ---------------- CONFUSION MATRIX ---------------- #
cm = confusion_matrix(all_labels, all_preds)

print("\n=== Confusion Matrix (Raw) ===")
print(cm)

# Plot confusion matrix
plt.figure(figsize=(6, 5))
sns.heatmap(cm, annot=True, fmt='d',
            xticklabels=class_names,
            yticklabels=class_names,
            cmap='Blues')

plt.xlabel('Predicted')
plt.ylabel('Actual')
plt.title('Confusion Matrix')
plt.tight_layout()
plt.savefig('confusion_matrix.png')
plt.show()