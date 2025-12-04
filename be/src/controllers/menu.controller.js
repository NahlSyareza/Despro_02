const db = require("../models/database");

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  // The +1 makes it inclusive (so '10' is possible)
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const createMenu = async (req, res) => {
  try {
    const today = new Date();

    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, "0");
    const day = today.getDate().toString().padStart(2, "0");

    const kinou = `${year}-${month}-${day - 1}`;
    const ototoi = `${year}-${month}-${day - 2}`;
    const kyou = `${year}-${month}-${day}`;

    const getMenus = await db.query(
      "SELECT * FROM menu WHERE date=$1 OR date=$2",
      [kinou, ototoi]
      // ["2025-11-25", "2025-11-24"]
    );

    const getFoods = await db.query("SELECT name, class FROM food_material");

    const firstCohort = getMenus.rows[0].foods;
    const secondCohort = getMenus.rows[1].foods;

    console.log(firstCohort);
    console.log(secondCohort);

    const thirdCohort = getFoods.rows;

    console.log(thirdCohort);

    const firstLegion = new Set([...firstCohort, ...secondCohort]);

    const firstFilter = thirdCohort.filter((i) => !firstLegion.has(i.name));

    console.log(firstFilter);

    const firstGrouping = firstFilter.reduce((a, i) => {
      if (!a[i.class]) {
        a[i.class] = [];
      }

      a[i.class].push(i);

      return a;
    }, {});

    console.log(firstGrouping);

    const finalLesson = [];

    finalLesson.push(
      firstGrouping.karbo[getRandomInt(0, firstGrouping.karbo.length - 1)]
    );

    let counter = [2, 1, 1];

    counter.sort(() => Math.random - 0.5);

    let ctrl = 0;
    while (ctrl < 3) {
      while (counter[ctrl] > 0) {
        if (ctrl == 0) {
          finalLesson.push(
            firstGrouping.protein[
              getRandomInt(0, firstGrouping.protein.length - 1)
            ]
          );
        } else if (ctrl == 1) {
          finalLesson.push(
            firstGrouping.sayuran[
              getRandomInt(0, firstGrouping.sayuran.length - 1)
            ]
          );
        } else if (ctrl == 2) {
          finalLesson.push(
            firstGrouping.buah[getRandomInt(0, firstGrouping.buah.length - 1)]
          );
        }
        counter[ctrl]--;
      }
      ctrl++;
    }

    console.log(finalLesson);

    const saigo = finalLesson.map((i) => i.name);

    console.log(saigo);

    return res.status(200).json({
      msg: "Ok",
      payload: finalLesson,
    });
  } catch (e) {
    console.error(e.message);
    return res.status(500).send("Server error");
  }
};

const saveSelectedMenu = async (req, res) => {
  const { date, foods, vendor_id } = req.body;

  try {
    const lastInsert = await db.query(
      "INSERT INTO menu (date, foods, vendor_id) VALUES ($1,$2,$3) RETURNING *",
      [date, foods, vendor_id]
    );

    return res.status(200).json({
      msg: "Successfully saved selected menu",
      payload: lastInsert.rows,
    });
  } catch (e) {
    console.error(e.message);
    return res.status(500).send("Server error");
  }
};

const updateMenu = async (req, res) => {
  const { menu_id, foods } = req.body;

  try {
    const lastInsert = await db.query(
      "UPDATE menu SET foods=$2 WHERE menu_id = $1 RETURNING *",
      [menu_id, foods]
    );

    return res.status(200).json({
      msg: "Successfully updated menu",
      payload: lastInsert.rows,
    });
  } catch (e) {
    console.error(e.message);
    return res.status(500).send("Server error");
  }
};

const getMenuByVendor = async (req, res) => {
  const { vendor_id } = req.params;

  try {
    const query = await db.query("SELECT * FROM menu WHERE vendor_id=$1", [
      vendor_id,
    ]);

    if (query.rows.length < 1) {
      return res.status(200).json({
        msg: "Menu not found!",
        payload: [],
      });
    }

    return res.status(200).json({
      msg: "Menu retrieved!",
      payload: query.rows,
    });
  } catch (e) {
    console.error(e.message);
    return res.status(500).send("Server error");
  }
};

module.exports = {
  createMenu,
  saveSelectedMenu,
  getMenuByVendor,
  updateMenu,
};
