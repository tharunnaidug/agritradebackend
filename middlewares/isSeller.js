import jwt from 'jsonwebtoken'
import seller from '../models/seller.model.js';

export const verifySeller = async(req,res,next)=>{
    try {
        const token = req.cookies.jwt

        if (!token) {
            return res.status(400).json({ error: "No Token Found" })
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY)

        if (!decoded) {
            return res.status(400).json({ error: "Invaild Token" })
        }
        const User = await seller.findById(decoded.userId).select("-password")

        if (!User) {
            return res.status(400).json({ error: "User Not found" })
        }

        req.user = User;

        next();
    } catch (error) {
        console.log("ERROR in Is loggedin Middleware", error)
        res.status(500).json({ error: "Internal Server Error" })
    }
}