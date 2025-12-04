# Potongan kode endpoint prediksi (main.py)
@app.post("/predict", response_model=PredictionResponse)
async def predict_meal(file: UploadFile = File(...)):
  # ... (load image) ...
  results = model(image) # Inferensi YOLO
  
  for result in results:
    for box in result.boxes:
      confidence = float(box.conf[0])
      if confidence > 0.4:
        class_id = int(box.cls[0])
        class_name = model.names[class_id].lower().replace(" ", "_")
        
        # Ambil data nutrisi dari cache DB
        nutri = NUTRITION_DB.get(class_name, DEFAULT_NUTRI)
        
        # Akumulasi nilai gizi
        total_vals["calories"] += float(nutri.get("cal", 0))
        total_vals["protein"] += float(nutri.get("pro", 0))
        # ... (perhitungan lemak & karbohidrat) ...