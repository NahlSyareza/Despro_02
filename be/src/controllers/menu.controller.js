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
        
        recommendations[day][`Plan ${i}`] = [
          karbo ? karbo.name : "Nasi Putih",
          protein ? protein.name : "Telur Dadar",
          sayur ? sayur.name : "Tumis Kangkung",
          buah ? buah.name : "Pisang",
          minum ? minum.name : "Air Putih"
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
  const { weeklyPlan, vendor_id } = req.body; 
  
  if (!weeklyPlan || !vendor_id) {
      return res.status(400).json({ msg: "Data plan atau vendor_id tidak lengkap." });
  }

  try {
    // PERBAIKAN: 
    // 1. Menggunakan tabel 'menu' (singular) sesuai tables.sql
    // 2. Menggunakan kolom 'foods' (bukan food_items)
    // 3. Membungkus JSON string dalam array [] karena kolom 'foods' bertipe TEXT[]
    const query = `
        INSERT INTO menu (vendor_id, foods, date) 
        VALUES ($1, $2, NOW())
        RETURNING menu_id
    `;
    
    // Kita simpan seluruh JSON plan sebagai satu string di elemen pertama array
    const values = [vendor_id, [JSON.stringify(weeklyPlan)]];
    
    const result = await db.query(query, values);
  
    logger.info(`[Menu] Weekly plan saved for Vendor ${vendor_id} (ID: ${result.rows[0].menu_id})`);
    return res.status(201).json({ msg: "Menu mingguan berhasil disimpan!" });

  } catch (e) {
    logger.error(`[Menu Save Error]: ${e.message}`);
    return res.status(500).send("Gagal menyimpan menu.");
  }
};

// GET /menu/:vendor_id/active
const getActiveMenu = async (req, res) => {
  const { vendor_id } = req.params;
  try {
    // PERBAIKAN: Menggunakan tabel 'menu'
    const result = await db.query(
      `SELECT * FROM menu 
       WHERE vendor_id = $1 
       ORDER BY date DESC 
       LIMIT 1`, 
      [vendor_id]
    );

    if (result.rows.length === 0) {
      return res.status(200).json({ payload: null, msg: "Belum ada menu tersimpan." });
    }

    // Karena kita menyimpannya sebagai array string [ "{...}" ], 
    // kita ambil elemen pertama dan parse kembali menjadi JSON Object
    let activePlan = null;
    if (result.rows[0].foods && result.rows[0].foods.length > 0) {
        try {
            activePlan = JSON.parse(result.rows[0].foods[0]);
        } catch (err) {
            logger.warn("[Menu] Gagal parsing JSON menu dari DB");
        }
    }

    return res.status(200).json({ 
      payload: activePlan, 
      date: result.rows[0].date 
    });

  } catch (e) {
    logger.error(`[Menu Get Error]: ${e.message}`);
    return res.status(500).send("Server error");
  }
};

module.exports = {
  getMenuRecommendations,
  saveWeeklyPlan,
  getActiveMenu
};