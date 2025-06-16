// middleware/verifyJWT.js

const jwt = require("jsonwebtoken");
const JWT_SECRET = require("../config");

function verifyJWT(req, res, next) {
  const authHeader = req.headers["authorization"];

  if (!authHeader) return res.status(401).json({ message: "No token provided" });

  const token = authHeader.split(" ")[1]; // Bearer tokenString

  if (!token) return res.status(401).json({ message: "No token provided" });

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ message: "Invalid token" });

    req.user = decoded; // pass decoded user info to next handlers
    next();
  });
}

module.exports = verifyJWT;


// const jwt=require("jsonwebtoken")
// const secret=require("../config")
// const varifyJWT=(req,res,next)=>{
//     const token=req.cookies.jwt //req.cookie le chai direct cookie store vako bata jwt vaneko token dinxa ,jwt vaneko chai cookie ko name ho jun chai hamile agi res,cookie ma lekheko thim
//     console.log("Cookies received:", req.cookies);
//     if(!token){
//         return res.status(401).json({message:"No token,authorization denied"})
//     }
//     try {
//         const decoded=jwt.verify(token,secret) //yo jwt.verify vaneko chai jsonwebtoken package le deko ho ,jasko kaam chai hamro jwt lae verify garne ho tyo right xa ki xaena vanera
//         req.user=decoded//decoded vako data lae req.user ma set gareko
//         next()//yo chai euta middleware ho jasle chai express lae move gar vanxa 
//     } catch (error) {
//         res.status(401).json({ message: "Invalid token" });
//     }
// }
// module.exports=varifyJWT