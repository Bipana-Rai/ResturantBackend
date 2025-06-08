const express = require("express");
const router = express.Router();
const takeawayModel = require("../models/takeawayModel");
const crypto = require("crypto");
const axios = require("axios");
const qs = require("qs");

// eSewa configuration
const esewaConfig = {
  merchantId: process.env.ESEWA_MERCHANT_ID,
  successUrl: process.env.ESEWA_SUCCESS_URL,
  failureUrl: process.env.ESEWA_FAILURE_URL,
  secretKey: process.env.ESEWA_SECRET_KEY,
  paymentUrl: "https://rc.esewa.com.np/epay/main",
};

router.post("/takeaway", async (req, res) => {
  const { name, number, cartItems, totalAmount, status, takeAwayStatus ,foodStatus} =
    req.body;
  console.log("take", req.body);
  console.log("byee");

  try {
    // Create order
    const orderId = "ORD" + Date.now();
    const newOrder = new takeawayModel({
      orderId,
      name,
      number,
      cartItems,
      totalAmount,
      status,
      takeAwayStatus,
      foodStatus
    });

    // Save order to database
    await newOrder.save();

    // Prepare eSewa payment data
    const paymentData = {
      amount: totalAmount,
      failure_url: esewaConfig.failureUrl,
      product_delivery_charge: "0",
      product_service_charge: "0",
      product_code: esewaConfig.merchantId,
      signed_field_names: "total_amount,transaction_uuid,product_code",
      success_url: esewaConfig.successUrl,
      tax_amount: "0",
      total_amount: totalAmount,
      transaction_uuid: orderId,
    };

    // Generate signature
    const queryString = new URLSearchParams(paymentData).toString();

    // Add signature to payment data
    const paymentUrl = `https://esewa.com.np/epay/main?${queryString}`;

    res.status(200).json({
      url: paymentUrl,
      orderId,
      amount: totalAmount,
    });
  } catch (error) {
    console.error("Error while creating takeaway order:", error);
    res.status(500).json({
      message: "Failed to create takeaway order",
      error: error.message,
    });
  }
});
router.get("/esewa-success", async (req, res) => {
  const { oid } = req.query;
  console.log(req.query);
  try {
    const order = await takeawayModel.findOne({ orderId: oid });
    if (!order) return res.status(404).json({ message: "order not found" });
    order.takeAwayStatus = "paid";
    order.paymentDetails = {
      method: "Esewa",
      esewaRef: req.query.refId || "ref-missing",
    };
    await order.save();
    res.redirect("http://localhost:5174/menu");
  } catch (error) {
    res.status(500).json("Server error");
  }
});
router.get("/esewa-failure", async (req, res) => {
  const { oid } = req.query;
  console.log(req.query);
  try {
    const order = await takeawayModel.findOne({ orderId: oid });
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.takeAwayStatus = "failed";
    order.paymentDetails = {
      method: "Esewa",
      esewaRef: req.query.refId || "ref-missing",
    };

    await order.save();

    res.redirect("http://localhost:5174/menu"); // Or redirect to a failure page
  } catch (err) {
    console.error("eSewa failure error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});
router.get("/getTakeAway", async (req, res) => {
  try {
    const data = await takeawayModel.find().sort({ createdAt: -1 });
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
 router.put("/updateTakeAwayStatus/:id", async (req, res) => {
    const { id } = req.params;
    const data = req.body;

    try {
      const takeaway = await takeawayModel.findByIdAndUpdate(id, data);
      console.log(takeaway)
      res.status(200).json(takeaway);
    } catch (error) {
      console.log(error)
     res.status(500).json({ message: error.message });
    }
  });
  router.delete("/deleteTakeawayReceit//:id", async (req, res) => {
      const { id } = req.params;
      try {
        const deleteData = await takeawayModel.findByIdAndDelete( id );
        res.status(200).json(deleteData);
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
    });

module.exports = router;
