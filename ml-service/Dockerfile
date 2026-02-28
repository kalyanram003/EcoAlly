FROM python:3.11-slim

WORKDIR /app

# Install system dependencies (for OpenCV / image libs if needed)
RUN apt-get update && apt-get install -y \
    libglib2.0-0 libsm6 libxrender1 libxext6 \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy app source
COPY . .

# Use Render's dynamic PORT
CMD ["sh", "-c", "uvicorn main:app --host 0.0.0.0 --port $PORT"]















# FROM python:3.11-slim

# WORKDIR /app

# RUN apt-get update && apt-get install -y \
#     libglib2.0-0 libsm6 libxrender1 libxext6 \
#     && rm -rf /var/lib/apt/lists/*

# COPY requirements.txt .
# RUN pip install --no-cache-dir -r requirements.txt

# COPY . .

# EXPOSE 5000

# CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "5000"]
