const Review = require("../models/ReviewSchema");

const fill = async (req, res) => {
  const { message } = req.body;
  const { idtr } = req.params;

  const ima = new Date();

  const kotoshi = ima.getFullYear();
  const kongatsu = ima.getMonth() + 1;
  const kyou = ima.getDate() + 1;

  const d = new Review({
    idtr,
    date: `${kotoshi}-${kongatsu}-${kyou}`,
    message,
  });

  try {
    await d.save();

    return res.status(200).json({
      s: true,
      m: "Sukisukisukisuki",
      p: d,
    });
  } catch (e) {
    return res.send(e);
  }
};

module.exports = {
  fill,
};
