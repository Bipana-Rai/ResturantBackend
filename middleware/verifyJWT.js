const jwt=require("jsonwebtoken")
const secret=require("../config")
const varifyJWT=(req,res,next)=>{
    const token=req.cookies.jwt //req.cookie le chai direct cookie store vako bata jwt vaneko token dinxa ,jwt vaneko chai cookie ko name ho jun chai hamile agi res,cookie ma lekheko thim
    if(!token){
        return res.status(401).json({message:"No token,authorization denied"})
    }
    try {
        const decoded=jwt.verify(token,secret) //yo jwt.verify vaneko chai jsonwebtoken package le deko ho ,jasko kaam chai hamro jwt lae verify garne ho tyo right xa ki xaena vanera
        req.user=decoded//decoded vako data lae req.user ma set gareko
        next()//yo chai euta middleware ho jasle chai express lae move gar vanxa 
    } catch (error) {
        res.status(401).json({ message: "Invalid token" });
    }
}
module.exports=varifyJWT