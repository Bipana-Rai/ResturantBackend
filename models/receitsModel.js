const mongoose = require("mongoose");
const receit = new mongoose.Schema({
  tableNumber: {
    type: String,
  },
  cartItems: [
    {
      dishName: { type: String, required: true },
      dishPrice: { type: Number, required: true, min: 0 },
      quantity: { type: Number, required: true, min: 1 },
    },
  ],

  totalAmount: {
    type: Number,
  },
  status: {
    type: String,
  },
  paidAt: {
    type: String,
  },
  paymentMethod: {
    type: String,
  },
});
const receitSchema = mongoose.model("receitS",receit);
module.exports = receitSchema;
