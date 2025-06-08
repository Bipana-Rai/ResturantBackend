const mongoose = require("mongoose");
const bookingData = new mongoose.Schema({
  fullName: String,
  email: String,
  members: Number,
  phNo: String,
  tableNumber:String,
  location: String,
  bookingDate: String,
  bookingTime: String,
  status:String,
},{
    timestamps:true
});
const bookingDataSchema=mongoose.model("BookingData",bookingData)
module.exports=bookingDataSchema
