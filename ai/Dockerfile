# Gunakan image python yang ringan
FROM python:3.10-slim

# Set working directory
WORKDIR /app

# --- PERBAIKAN DI SINI ---
# Ganti 'libgl1-mesa-glx' menjadi 'libgl1'
RUN apt-get update && apt-get install -y \
    libgl1 \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*
# ------------------------

# Salin requirements dan install dependencies
COPY requirements.txt .
# Upgrade pip agar proses install lebih lancar
RUN pip install --no-cache-dir --upgrade pip
RUN pip install --no-cache-dir -r requirements.txt

# Salin source code (termasuk model.pt dan main.py)
COPY . .

# Expose port 8000
EXPOSE 8000

# Jalankan server
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]