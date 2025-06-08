const express = require("express");
const receitsModel = require("../models/receitsModel");
const router = express.Router();
router.post("/receits", async (req, res) => {
  const data = req.body;
  try {
    const receit = new receitsModel({
      tableNumber: data.tableNumber,
      cartItems: data.cartItems,
      totalAmount: data.totalAmount,
      status: data.status,
      paidAt: data.paidAt,
      paymentMethod: data.paymentMethod,
    });
    const saveData = receit.save();
    res.status(200).json(saveData);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
module.exports = router;
