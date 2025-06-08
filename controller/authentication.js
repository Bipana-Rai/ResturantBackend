const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
const JWT_SECRET = require("../config");
const signupSchema = require("../models/signupModel");
const verifyJWT = require("../middleware/verifyJWT");
const nodemailer = require("nodemailer");

router.post("/signupData", async (req, res) => {
  try {
    const { email, password, fullName, phone,role } = req.body;
    console.log("hello");
    if (!email || !password || !fullName || !phone ||!role) {
      return res.status(400).json({ message: "Missing Field" });
    }

    const existingUser = await signupSchema.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }
    const hashPassword = await bcrypt.hash(password, 10);
    const user = new signupSchema({
      email,
      password: hashPassword,
      fullName,
      phone,
      role
    });
    const saveData = await user.save();

    res.status(201).json({ message: " Register Successfully", user: saveData });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
router.post("/loginData", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "field is missing" });
    }
    const doesExistUser = await signupSchema.findOne({ email });
    if (!doesExistUser) {
      return res.status(400).json({ message: "user not found" });
    }
    const isPasswordValidate = await bcrypt.compare(
      password,
      doesExistUser.password
    );
    if (!isPasswordValidate) {
      return res.status(400).json({ message: "Incorrect Password" });
    }
    var token = jwt.sign({ ...doesExistUser.toObject() }, JWT_SECRET, {
      expiresIn: "1h", //kati time pxi expire hune
    });
    res.cookie("jwt", token, {
      httpOnly: true, //yesko kamm vaneko client side le yeslae change garna or access garna bata rokxa
      maxAge: 60 * 60 * 1000, //yo veneko cookie chai 1 hour ma expire hunxa
      sameSite: "lax",
    });

    res.status(201).json({ message: " Login Successfully", token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
router.get("/customer/verify", verifyJWT, (req, res) => {
  if (req.user.role !== "customer") {
    return res.status(403).json({ message: "Access denied: Not a customer" });
  }
  res.status(200).json({ message: "user verified", user: req.user });
});
router.get("/admin/verify", verifyJWT, (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied: Not an admin" });
  }
  res.status(200).json({ message: "admin verified", user: req.user });
});

router.post("/logout", (req, res) => {
  res.clearCookie("jwt", {
    httpOnly: true,
    sameSite: "lax",
  });
  res.status(200).json({ message: "Logged out successfully" });
});

router.post("/auth/forgot-password", async (req, res) => {
  const { email } = req.body;
  try {
    const oldUser = await signupSchema.findOne({ email });
    if (!oldUser) return res.status(404).json({ message: "User not found" });
    const token = jwt.sign(
      { email: oldUser.email, id: oldUser._id },
      JWT_SECRET,
      {
        expiresIn: "5m",
      }
    );
    const link = `http://localhost:5173/reset-password/${oldUser._id}/${token}`;
    console.log(link);
    // euta transporter object create garxa using smtp
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "bipanarai982@gmail.com",
        pass: "xaarwekgibbttwbb",
      },
    });
    //mail options
    let mailOptions = {
      from: "tastyFood@gmail.com",
      to: oldUser.email,
      subject: "password Reset Link",
      html: `<p> Click <a href="${link}"> here</a> to reset your password.</p>`,
    };
    //send mail
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error(error);
        return res.status(500).json({ message: "Email not sent" });
      }
      res.status(200).json({ message: "Reset link sent to your email" });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
});
router.get("/reset-password/:id/:token", async (req, res) => {
  const { id, token } = req.params;
  const oldUser = await signupSchema.findOne({ _id: id });
  if (!oldUser) {
    return res.json({ status: "User not existed" });
  }

  try {
    const verify = jwt.verify(token, JWT_SECRET);
  } catch (error) {}
  console.log(req.params);
  res.send("done");
});
router.post("/reset-password/:id/:token", async (req, res) => {
  const { id, token } = req.params;
  const { password } = req.body;
  const oldUser = await signupSchema.findOne({ _id: id });
  if (!oldUser) {
    return res.json({ status: "User not existed" });
  }

  try {
    const verify = jwt.verify(token, JWT_SECRET);
    const encryptedPassword = await bcrypt.hash(password, 10);
    const updateResult = await signupSchema.updateOne(
      { _id: id },
      { $set: { password: encryptedPassword } }
    );
    return res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error(error);
  }

  return res
    .status(500)
    .json({ message: "Something went wrong or token expired" });
});
module.exports = router;
