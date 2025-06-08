const mongoose = require("mongoose");
const takeaway = new mongoose.Schema(
  {
    orderId: { type: String, required: true, unique: true },

    cartItems: [
      {
        dishName: { type: String, required: true },
        dishPrice: { type: Number, required: true, min: 0 },
        quantity: { type: Number, required: true, min: 1 },
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      required: true,
    },
    paymentDetails: {
      method: String,
      esewaRef: String,
    },
    foodStatus: {
      type: String,
    },
    takeAwayStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },
  },
  { timestamps: true }
);
const takeawayModel = mongoose.model("takeAway", takeaway);

module.exports = takeawayModel;
