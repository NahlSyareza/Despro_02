const db = require("../models/database");
const logger = require("../utils/logger");

// Helper untuk item acak
const getRandomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];

// 1. Generate Rekomendasi (Logic Sama, Output JSON)
const getMenuRecommendations = async (req, res) => {
  try {
    const result = await db.query("SELECT name, class FROM food_material");
    const foods = result.rows;

    if (foods.length === 0) {
      return res.status(404).json({ msg: "Database bahan makanan kosong!" });
    }

    const grouped = {
      Karbo: foods.filter(f => /karbo|carbo/i.test(f.class)),
      Protein: foods.filter(f => /protein|lauk/i.test(f.class)),
      Sayur: foods.filter(f => /sayur|vegetable/i.test(f.class)),
      Buah: foods.filter(f => /buah|fruit/i.test(f.class)),
      Minum: foods.filter(f => /minum|drink|susu/i.test(f.class)) 
    };

    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
    const recommendations = {};

    days.forEach(day => {
      recommendations[day] = {};
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

    return res.status(200).json({ msg: "Generated", payload: recommendations });
  } catch (e) {
    logger.error(`[Menu Rec Error]: ${e.message}`);
    return res.status(500).send("Server error");
  }
};

const getSmartRecommendation = async (req, res) => {
  const { vendor_id } = req.params;

  try {
    // 1. Logika Cerdas: Cari menu sukses di masa lalu
    const highRatedMenus = await db.query(`
      SELECT m.foods 
      FROM menu m
      JOIN review r ON m.date = r.date AND m.vendor_id = r.vendor_id
      WHERE m.vendor_id = $1
      GROUP BY m.menu_id
      HAVING AVG(r.rating) >= 4.0
    `, [vendor_id]);

    let foodPool = [];
    if (highRatedMenus.rows.length > 0) {
      highRatedMenus.rows.forEach(row => {
        // row.foods adalah array ["Nasi", "Ayam", ...]
        // Filter nilai "-" atau null
        const validFoods = row.foods.filter(f => f && f !== "-");
        foodPool = [...foodPool, ...validFoods];
      });
      foodPool = [...new Set(foodPool)]; // Unik
    }

    // 2. Ambil referensi bahan makanan (agar tahu mana Karbo/Protein)
    let queryMaterial;
    if (foodPool.length > 0) {
      queryMaterial = await db.query(
        "SELECT name, class FROM food_material WHERE name = ANY($1)", 
        [foodPool]
      );
    } else {
      // Fallback: Ambil semua jika history kosong
      queryMaterial = await db.query("SELECT name, class FROM food_material");
    }

    const materials = queryMaterial.rows;
    
    // Helper filter regex yang sama dengan fungsi lama Anda
    const carbs = materials.filter(f => /karbo|carbo/i.test(f.class));
    const proteins = materials.filter(f => /protein|lauk/i.test(f.class));
    const veggies = materials.filter(f => /sayur|vegetable/i.test(f.class));
    const fruits = materials.filter(f => /buah|fruit/i.test(f.class));
    const drinks = materials.filter(f => /minum|drink|susu/i.test(f.class));

    // Validasi data
    if (!carbs.length || !proteins.length) {
       return res.status(400).json({ msg: "Data bahan makanan tidak cukup." });
    }

    // 3. Generate Struktur Menu Mingguan (Format Frontend)
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
    const smartMenu = {};

    days.forEach(day => {
       // Ambil item acak
       const c = getRandomItem(carbs)?.name || "Nasi Putih";
       const p = getRandomItem(proteins)?.name || "Telur Dadar";
       const v = getRandomItem(veggies)?.name || "Tumis Sayur";
       const f = getRandomItem(fruits)?.name || "Pisang";
       const d = getRandomItem(drinks)?.name || "Air Mineral";

       // Sesuaikan format dengan Frontend (SelectedMenu.jsx)
       smartMenu[day] = {
          day: day,
          selectedPlanName: "AI Recommended",
          Carbohydrate: [c],
          Protein: [p],
          Vegetables: [v],
          Fruit: [f],
          Drink: [d]
       };
    });

    res.json({
       status: "success",
       source: foodPool.length > 0 ? "historical_best" : "random_balanced",
       payload: smartMenu 
    });

  } catch (error) {
    logger.error(`[Smart Rec] Error: ${error.message}`);
    res.status(500).json({ msg: "Server Error" });
  }
};

// 2. Simpan Menu Mingguan (REVISI: Simpan Per Tanggal)
const saveWeeklyPlan = async (req, res) => {
  const { vendor_id, weeklyPlan, startDate } = req.body; 
  // startDate format: "YYYY-MM-DD" (Hari Senin dari minggu tersebut)

  if (!weeklyPlan || !vendor_id || !startDate) {
      return res.status(400).json({ msg: "Data tidak lengkap (Butuh startDate)." });
  }

  const client = await db.pool?.connect ? await db.pool.connect() : { query: db.query, release: () => {} }; // Fallback jika db wrapper beda

  try {
    // Loop 5 Hari (Senin - Jumat)
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
    
    // Loop 5 hari kerja
    for (let i = 0; i < 5; i++) {
        const dayName = days[i];
        const dayData = weeklyPlan[dayName];

        // Hitung tanggal: startDate + i hari
        // Kita asumsikan startDate string "YYYY-MM-DD" sudah benar dari frontend
        const d = new Date(startDate);
        d.setDate(d.getDate() + i);
        const dateStr = d.toISOString().split('T')[0];

        // LANGKAH 1: SELALU HAPUS DATA LAMA (Fix bug delete)
        // Kita hapus dulu menu di tanggal & vendor ini, entah user mau isi baru atau kosongkan
        await db.query("DELETE FROM menu WHERE vendor_id = $1 AND date = $2", [vendor_id, dateStr]);

        // LANGKAH 2: INSERT BARU (Hanya jika ada datanya)
        if (dayData) {
            const foodArray = [
                dayData.Carbohydrate?.[0] || "-",
                dayData.Protein?.[0] || "-",
                dayData.Vegetables?.[0] || "-",
                dayData.Fruit?.[0] || "-",
                dayData.Drink?.[0] || "-"
            ];

            await db.query(
                "INSERT INTO menu (vendor_id, date, foods) VALUES ($1, $2, $3)",
                [vendor_id, dateStr, foodArray]
            );
        }
    }
    
    logger.info(`[Menu] Saved weekly plan starting ${startDate}`);
    return res.status(201).json({ msg: "Menu berhasil disimpan!" });

  } catch (e) {
    logger.error(`[Menu Save Error]: ${e.message}`);
    return res.status(500).send("Gagal menyimpan menu.");
  } finally {
    // client.release(); // Uncomment jika pakai pool.connect manual
  }
};

// 3. Ambil Menu Berdasarkan Range Tanggal (Mingguan)
const getWeeklyMenu = async (req, res) => {
  const { vendor_id } = req.params;
  const { startDate, endDate } = req.query; // YYYY-MM-DD

  try {
    const result = await db.query(
      `SELECT date, foods FROM menu 
       WHERE vendor_id = $1 AND date >= $2 AND date <= $3`,
      [vendor_id, startDate, endDate]
    );

    // Format balik ke struktur Frontend (Mapping Date -> Day Name)
    const formattedPayload = {};
    const daysMap = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    result.rows.forEach(row => {
        const d = new Date(row.date);
        const dayName = daysMap[d.getDay()]; // Ambil nama hari dari tanggal

        // Kembalikan ke struktur { Carbohydrate: [], ... }
        if (dayName && row.foods) {
            formattedPayload[dayName] = {
                day: dayName,
                selectedPlanName: "Custom / Saved",
                Carbohydrate: [row.foods[0]],
                Protein: [row.foods[1]],
                Vegetables: [row.foods[2]],
                Fruit: [row.foods[3]],
                Drink: [row.foods[4]]
            };
        }
    });

    return res.status(200).json({ payload: formattedPayload });

  } catch (e) {
    logger.error(`[Menu Get Error]: ${e.message}`);
    return res.status(500).send("Server error");
  }
};

// Endpoint legacy (optional, agar tidak error jika dipanggil)
const getActiveMenu = async (req, res) => {
    return res.status(200).json({ payload: null, msg: "Deprecated. Use getWeeklyMenu" });
};

module.exports = {
  getMenuRecommendations,
  saveWeeklyPlan,
  getWeeklyMenu,
  getActiveMenu,
  getSmartRecommendation
};