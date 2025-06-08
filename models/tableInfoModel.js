const mongoose = require("mongoose");
const tableInfo = new mongoose.Schema(
  {
    tableNum: {
      type: String,
      required: true,
    },
    tableCapacity: {
      type: Number,
      required: true,
    },
    tableLocation: {
      type: String,
    },
    tableStatus: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
const tableInfoSchma = mongoose.model("tableInfo", tableInfo);
module.exports = tableInfoSchma;
