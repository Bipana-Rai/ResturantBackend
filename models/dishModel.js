const mongoose = require("mongoose");
const item = new mongoose.Schema({
  dishName: {
    type: String,
    require: true,
  },
  dishPrice: {
    type: Number,
    require: true,
  },
  dishImage: {
    type: String,
  },
  dishCategory:{
    type: String,
  },
  dishDiscription: {
    type: String,
    require: true,
  },
});
const dishSchema=mongoose.model("dish",item)
module.exports=dishSchema;
