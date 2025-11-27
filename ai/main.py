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

# Load environment variables (untuk DB credentials)
load_dotenv()

# --- KONFIGURASI DATABASE ---
# Pastikan Anda setting variable environment DATABASE_URL nanti
DATABASE_URL = os.getenv("DATABASE_URL")

# Inisialisasi Variable Global
model = None
NUTRITION_DB = {} # Akan diisi dari Database saat startup
DEFAULT_NUTRI = {"calories": 50, "protein": 1, "carbohydrate": 5, "fat": 1}

# --- FUNGSI LOAD DATA DARI DB ---
def load_nutrition_data():
    """Mengambil data nutrisi dari tabel food_material di NeonDB"""
    global NUTRITION_DB
    print("🔄 Menghubungkan ke Database untuk mengambil data nutrisi...")
    
    if not DATABASE_URL:
        print("⚠️  Peringatan: DATABASE_URL tidak ditemukan. Menggunakan data kosong.")
        return

    try:
        conn = psycopg2.connect(DATABASE_URL)
        cur = conn.cursor(cursor_factory=RealDictCursor)
        
        # Query sesuai spesifikasi tabel food_material Anda
        query = "SELECT name, calories, fat, protein, carbohydrate FROM food_material"
        cur.execute(query)
        rows = cur.fetchall()
        
        count = 0
        for row in rows:
            # Normalisasi key: ubah nama makanan jadi lowercase agar cocok dengan label YOLO
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

# --- LIFESPAN EVENT (Jalan saat server start) ---
@asynccontextmanager
async def lifespan(app: FastAPI):
    # 1. Load Model YOLO
    global model
    try:
        model = YOLO("model.pt")
        print("✅ Model YOLOv8 berhasil dimuat!")
    except Exception as e:
        print(f"❌ Gagal memuat model: {e}")
    
    # 2. Load Data Nutrisi dari DB
    load_nutrition_data()
    
    yield
    # (Kode cleanup jika ada, bisa ditaruh di sini)

app = FastAPI(title="MBG AI Service", lifespan=lifespan)

# --- SCHEMA OUTPUT ---
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
                # Nama class dari YOLO (misal: "nasi_putih")
                class_name = model.names[class_id].lower().replace(" ", "_")
                confidence = float(box.conf[0])

                if confidence > 0.4:
                    detected_items.append(class_name)
                    
                    # Cari di NUTRITION_DB (yang sudah diload dari SQL)
                    # Jika tidak ada, pakai DEFAULT_NUTRI
                    nutri = NUTRITION_DB.get(class_name, DEFAULT_NUTRI)
                    
                    # Mapping key dictionary nutrition_db ke key output
                    # NUTRITION_DB keys: 'cal', 'fat', 'pro', 'carb'
                    # DEFAULT keys: 'calories', 'protein', ... (perlu disamakan logicnya)
                    
                    # Ambil nilai dengan handling perbedaan nama key yang mungkin terjadi
                    cal = nutri.get("cal", nutri.get("calories", 0))
                    fat = nutri.get("fat", nutri.get("fat", 0))
                    pro = nutri.get("pro", nutri.get("protein", 0))
                    carb = nutri.get("carb", nutri.get("carbohydrate", 0))

                    total_vals["calories"] += float(cal)
                    total_vals["fat"] += float(fat)
                    total_vals["protein"] += float(pro)
                    total_vals["carbohydrate"] += float(carb)

        # Hitung Skor
        score = 100.0
        if total_vals["calories"] < 400: score = 60.0
        elif total_vals["calories"] > 850: score = 70.0

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