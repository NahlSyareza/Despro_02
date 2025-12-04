const db = require("../models/database");
const logger = require("../utils/logger");

// Helper untuk mengambil item acak dari array
const getRandomItem = (arr) => {
  if (!arr || arr.length === 0) return null;
  return arr[Math.floor(Math.random() * arr.length)];
};

// Endpoint 1: Generate Rekomendasi Menu Mingguan Otomatis
const getMenuRecommendations = async (req, res) => {
  try {
    // 1. Ambil semua bahan makanan dari Database
    const result = await db.query("SELECT name, class FROM food_material");
    const foods = result.rows;

    if (foods.length === 0) {
      return res.status(404).json({ msg: "Database bahan makanan kosong! Harap isi tabel food_material." });
    }

    // 2. Grouping berdasarkan Kelas/Kategori
    // Logika filter fleksibel (case-insensitive)
    const grouped = {
      Karbo: foods.filter(f => /karbo|carbo/i.test(f.class)),
      Protein: foods.filter(f => /protein|lauk/i.test(f.class)),
      Sayur: foods.filter(f => /sayur|vegetable/i.test(f.class)),
      Buah: foods.filter(f => /buah|fruit/i.test(f.class)),
      Minum: foods.filter(f => /minum|drink|susu/i.test(f.class)) 
    };

    // 3. Generate Jadwal Senin - Jumat
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
    const recommendations = {};

    days.forEach(day => {
      recommendations[day] = {};
      
      // Buat 4 Plan Berbeda tiap hari
      for (let i = 1; i <= 4; i++) {
        const karbo = getRandomItem(grouped.Karbo);
        const protein = getRandomItem(grouped.Protein);
        const sayur = getRandomItem(grouped.Sayur);
        const buah = getRandomItem(grouped.Buah);
        const minum = getRandomItem(grouped.Minum);
        
        // Format array string agar sesuai dengan Frontend
        // Urutan Wajib: [Karbo, Protein, Sayur, Buah, Minum]
        recommendations[day][`Plan ${i}`] = [
          karbo ? karbo.name : "Nasi Putih",
          protein ? protein.name : "Telur Dadar",
          sayur ? sayur.name : "Tumis Kangkung",
          buah ? buah.name : "Pisang",
          minum ? minum.name : "Air Putih" // Default jika kosong
        ];
      }
    });

    logger.info("[Menu] Generated weekly recommendations successfully");
    
    return res.status(200).json({
      msg: "Recommendations generated",
      payload: recommendations
    });

  } catch (e) {
    logger.error(`[Menu Error]: ${e.message}`);
    return res.status(500).send("Server error");
  }
};

// Endpoint 2: Simpan Menu Terpilih ke Database
const saveWeeklyPlan = async (req, res) => {
  // Frontend mengirim object menu lengkap dan vendor_id
  const { weeklyPlan, vendor_id } = req.body; 
  
  if (!weeklyPlan || !vendor_id) {
      return res.status(400).json({ msg: "Data plan atau vendor_id tidak lengkap." });
  }

  try {
    // Simpan ke tabel 'menus'
    // Kolom 'food_items' diasumsikan bertipe JSONB di database
    const query = `
        INSERT INTO menus (vendor_id, food_items, date) 
        VALUES ($1, $2, NOW())
        RETURNING menu_id
    `;
    
    const values = [vendor_id, JSON.stringify(weeklyPlan)];
    
    const result = await db.query(query, values);
  
    logger.info(`[Menu] Weekly plan saved for Vendor ${vendor_id} (ID: ${result.rows[0].menu_id})`);
    return res.status(201).json({ msg: "Menu mingguan berhasil disimpan!" });

  } catch (e) {
    logger.error(`[Menu Save Error]: ${e.message}`);
    return res.status(500).send("Gagal menyimpan menu.");
  }
};

module.exports = {
  getMenuRecommendations,
  saveWeeklyPlan
};