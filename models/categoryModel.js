const mongoose = require("mongoose");
const category = new mongoose.Schema({
  category: { type: String, required: true },
  image: { type: String, required: false },
});
const categorySchema = mongoose.model("Category", category);
module.exports = categorySchema;
