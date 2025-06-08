const express = require("express");
const router = express.Router();
const bookingData = require("../models/bookingData");
router.post("/addBookingDetail", async (req, res) => {
  const data = req.body;
  try {
    const bookeddata = new bookingData(data);
    const savedData =await bookeddata.save();
    res.status(200).json(savedData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
router.get("/getBookingDetail", async (req, res) => {
  try {
    const bookeddata =await bookingData.find();
    res.status(200).json(bookeddata);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
router.put("/editBookingDetail/:id", async (req, res) => {

   const { id } = req.params;
  const data = req.body;

  try {
    const bookeddata = await bookingData.findByIdAndUpdate(id,data)
    res.status(200).json(bookeddata);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
router.delete("/deleteBooking/:id", async (req, res) => {
  const {id}=req.params

  try {
    const deleteData = await bookingData.findByIdAndDelete(id)
    res.status(200).json(deleteData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
module.exports = router;
