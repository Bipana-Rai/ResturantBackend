const mongoose = require("mongoose");
const cartItem = new mongoose.Schema({
  userId: String,
  dishName: String,
  dishPrice: Number,
  dishImage: String,
  dishCategory: String,
  quantity: {
    type: Number,
    default: 1,
  },
});
const cartItemSchema = mongoose.model("cartItem", cartItem);
module.exports = cartItemSchema;
