const express = require("express");
const cartItemSchema = require("../models/cartItemModel");
const router = express.Router();
router.post("/cart", async (req, res) => {
  try {
    const data = req.body;
    if (data._id) {
      delete data._id;
    }

    const newCartItem = new cartItemSchema(data);
    const savedCartItem = await newCartItem.save();
    return res
      .status(201)
      .json({ message: "New cart item added", data: savedCartItem });
  } catch (error) {
    console.error("Error in /cart:", error);
    res.status(500).json({ message: error.message });
  }
});

router.get("/getCart/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    const data = await cartItemSchema.find({ userId });
    res.status(201).json({ message: "cart save item", data });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
router.put("/updateQuantity/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;
    const newData = await cartItemSchema.findByIdAndUpdate(
      id,
      { quantity: quantity },
      { new: true }
    );
    res.status(200).json(newData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
router.delete("/deleteCartItem/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deleteItem = await cartItemSchema.findByIdAndDelete(id);
    res.status(200).json(deleteItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
router.delete("/deleteCartOrder/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    const deleteItem = await cartItemSchema.deleteMany({ userId });
    res.status(200).json(deleteItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
module.exports = router;
