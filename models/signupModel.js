const mongoose = require("mongoose");
const signup = new mongoose.Schema({
  email: { type: String, require: true },
  password: { type: String, require: true },
  fullName: { type: String, require: true },
  role:{type:String,require:true},
  phone: { type: String, require: true },
});
const signupSchema = mongoose.model("signUp", signup);
module.exports = signupSchema;
