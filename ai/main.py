import os
import io
import psycopg2
from psycopg2.extras import RealDictCursor
from contextlib import asynccontextmanager
from fastapi import FastAPI, File, UploadFile, HTTPException
from pydantic import BaseModel
from PIL import Image
from ultralytics import YOLO
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# --- KONFIGURASI DATABASE ---
DATABASE_URL = os.getenv("DATABASE_URL")

# Inisialisasi Global
model = None
NUTRITION_DB = {} 
DEFAULT_NUTRI = {"calories": 50, "protein": 1, "carbohydrate": 5, "fat": 1}

# --- FUNGSI LOAD DATA DARI DB ---
def load_nutrition_data():
    global NUTRITION_DB
    print("🔄 Menghubungkan ke Database untuk mengambil data nutrisi...")
    
    if not DATABASE_URL:
        print("⚠️  Peringatan: DATABASE_URL tidak ditemukan. Menggunakan data kosong.")
        return

    try:
        conn = psycopg2.connect(DATABASE_URL)
        cur = conn.cursor(cursor_factory=RealDictCursor)
        
        query = "SELECT name, calories, fat, protein, carbohydrate FROM food_material"
        cur.execute(query)
        rows = cur.fetchall()
        
        count = 0
        for row in rows:
            # Normalisasi key: lowercase + underscore
            key = row['name'].lower().replace(" ", "_")
            NUTRITION_DB[key] = {
                "cal": float(row['calories']),
                "fat": float(row['fat']),
                "pro": float(row['protein']),
                "carb": float(row['carbohydrate'])
            }
            count += 1
            
        print(f"✅ Berhasil memuat {count} data makanan dari Database!")
        cur.close()
        conn.close()
    except Exception as e:
        print(f"❌ Gagal mengambil data dari DB: {e}")

# --- HELPER: HITUNG SKOR KEPATUHAN GIZI (BARU) ---
def calculate_compliance_score(nutrition):
    """
    Menghitung skor (0-100) berdasarkan standar makan siang anak sekolah.
    Bobot: Kalori (40%) + Protein (30%) + Lemak (15%) + Karbo (15%)
    """
    score = 0.0
    
    # 1. SKOR KALORI (Maks 40 Poin)
    # Target Ideal: 550 - 750 kkal
    cal = nutrition['calories']
    if 550 <= cal <= 750:
        score += 40
    elif 450 <= cal < 550 or 750 < cal <= 850:
        score += 30
    elif 350 <= cal < 450 or 850 < cal <= 950:
        score += 15
    else:
        score += 5 # Terlalu ekstrem (sangat sedikit/banyak)

    # 2. SKOR PROTEIN (Maks 30 Poin) - Zat Pertumbuhan
    # Target Ideal: > 20 gram
    pro = nutrition['protein']
    if pro >= 20:
        score += 30
    elif 15 <= pro < 20:
        score += 20
    elif 10 <= pro < 15:
        score += 10
    else:
        score += 0 # Sangat kurang protein

    # 3. SKOR LEMAK (Maks 15 Poin) - Batasi Lemak
    # Target Ideal: < 25 gram
    fat = nutrition['fat']
    if fat <= 25:
        score += 15
    elif 25 < fat <= 35:
        score += 10
    else:
        score += 5 # Terlalu berminyak

    # 4. SKOR KARBOHIDRAT (Maks 15 Poin)
    # Target Ideal: 50 - 100 gram
    carb = nutrition['carbohydrate']
    if 50 <= carb <= 100:
        score += 15
    elif 30 <= carb < 50 or 100 < carb <= 130:
        score += 10
    else:
        score += 5

    return round(score, 1)

# --- LIFESPAN EVENT ---
@asynccontextmanager
async def lifespan(app: FastAPI):
    global model
    try:
        model = YOLO("model.pt")
        print("✅ Model YOLOv8 berhasil dimuat!")
    except Exception as e:
        print(f"❌ Gagal memuat model: {e}")
    
    load_nutrition_data()
    yield

app = FastAPI(title="MBG AI Service", lifespan=lifespan)

class PredictionResponse(BaseModel):
    calories: float
    fat: float
    protein: float
    carbohydrate: float
    menu_names: list[str]
    compliance_score: float

@app.get("/")
def read_root():
    db_status = f"Loaded ({len(NUTRITION_DB)} items)" if NUTRITION_DB else "Empty/Failed"
    ai_status = "Ready" if model else "Model Failed"
    return {"status": "Running", "ai_model": ai_status, "nutrition_db": db_status}

@app.post("/predict", response_model=PredictionResponse)
async def predict_meal(file: UploadFile = File(...)):
    if model is None:
        raise HTTPException(status_code=503, detail="Model AI belum siap.")
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image")

    try:
        contents = await file.read()
        image = Image.open(io.BytesIO(contents))

        # Inferensi YOLO
        results = model(image)
        
        detected_items = []
        total_vals = {"calories": 0.0, "fat": 0.0, "protein": 0.0, "carbohydrate": 0.0}

        for result in results:
            for box in result.boxes:
                class_id = int(box.cls[0])
                class_name = model.names[class_id].lower().replace(" ", "_")
                confidence = float(box.conf[0])

                if confidence > 0.4:
                    detected_items.append(class_name)
                    
                    # Ambil Nutrisi (Fallback ke Default jika tidak ada di DB)
                    nutri = NUTRITION_DB.get(class_name, DEFAULT_NUTRI)
                    
                    # Handle perbedaan nama key (cal vs calories) dari DB vs Default
                    cal = nutri.get("cal", nutri.get("calories", 0))
                    fat = nutri.get("fat", nutri.get("fat", 0))
                    pro = nutri.get("pro", nutri.get("protein", 0))
                    carb = nutri.get("carb", nutri.get("carbohydrate", 0))

                    total_vals["calories"] += float(cal)
                    total_vals["fat"] += float(fat)
                    total_vals["protein"] += float(pro)
                    total_vals["carbohydrate"] += float(carb)

        # --- LOGIKA SKOR BARU DI SINI ---
        score = calculate_compliance_score(total_vals)

        return {
            "calories": round(total_vals["calories"], 2),
            "fat": round(total_vals["fat"], 2),
            "protein": round(total_vals["protein"], 2),
            "carbohydrate": round(total_vals["carbohydrate"], 2),
            "menu_names": detected_items if detected_items else ["Tidak terdeteksi"],
            "compliance_score": score
        }

    except Exception as e:
        print(f"Prediction Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)