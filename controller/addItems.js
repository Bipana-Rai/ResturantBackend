const express = require("express");
const router = express.Router();
const multer = require("multer");

const categorySchema = require("../models/categoryModel");
const dishSchema = require("../models/dishModel");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});
const upload = multer({ storage });

router.post("/addCategory", upload.single("image"), async (req, res) => {
  const { category } = req.body;
  const image = req.file ? req.file.filename : null;
  console.log(req.file);
  try {
    if (!category) {
      return res.status(400).json({ message: "category is requre" });
    }
    const data = new categorySchema({
      category,
      image,
    });
    const savedData = await data.save();
    res.status(201).json(savedData);
  } catch (error) {
    console.log(error);
  }
});
router.get("/getCategory", async (req, res) => {
  try {
    const category = await categorySchema.find();
    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
router.post("/addDish", upload.single("dishImage"), async (req, res) => {
  const { dishName, dishPrice, dishCategory, dishDiscription } = req.body;
  const dishImage = req.file ? req.file.filename : null;
  console.log(req.body);
  try {
    if (!dishName || !dishPrice) {
      return res.status(400).json("Field is missing");
    }
    const data = new dishSchema({
      dishName,
      dishPrice,
      dishImage,
      dishCategory,
      dishDiscription,
    });
    const saveData = await data.save();
    return res.status(200).json({ saveData });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
router.get("/getDish", async (req, res) => {
  try {
    const data = await dishSchema.find();
    res.status(200).json({ data });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
module.exports = router;
