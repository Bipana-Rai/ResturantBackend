const express = require("express");
const router = express.Router();
const tableInfoSchma = require("../models/tableInfoModel");
router.post("/addTable", async (req, res) => {
  try {
    const data = req.body;
    const newData = new tableInfoSchma(data);
    const saveData = await newData.save();
    res.status(200).json(saveData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
router.get("/getTable", async (req, res) => {
  try {
    const data = await tableInfoSchma.find();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
router.put("/updateStatus/:id", async (req, res) => {
  const { id } = req.params;
  const data = req.body;
    
 
  try {
    const updateData = await tableInfoSchma.findByIdAndUpdate(id, data);
 
    res.status(200).json(updateData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/editTable/:id", async (req, res) => {
  const { id } = req.params;
  const data = req.body;

  try {
    const updateData = await tableInfoSchma.findByIdAndUpdate(id, data);
    res.status(200).json(updateData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
router.delete("/deleteTable/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const deleteData = await tableInfoSchma.findByIdAndDelete(id);
    res.status(200).json(deleteData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
module.exports = router;
