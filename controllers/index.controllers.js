import cartModel from "../models/cart.model.js";
import user from "../models/user.model.js";
import seller from "../models/seller.model.js";
import genarateJwtToken from "../utills/genarateJwt.js";
import productModel from "../models/product.model.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { sendMails } from "./sendEmails.js";

export const index = async (req, res) => {
    res.send("Welcome to AgriTrade Backend !!!")
}

export const register = async (req, res) => {
    try {
        const { username, password, email, phno, name, dob, gender, seller, profilePic } = req.body;

        if (!username || !password || !email || !name || !phno) return res.status(500).json({ error: "All Fields Required" })

        if (await user.findOne({ username })) return res.status(500).json({ error: "Username Already Exist" })
        if (await user.findOne({ email })) return res.status(500).json({ error: "Email Already Exist" })
        if (await user.findOne({ phno })) return res.status(500).json({ error: "Phone Number Already Exist" })

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new user({
            username: username,
            password: hashedPassword,
            email: email,
            phno: phno,
            name: name,
            dob: dob,
            gender: gender,
            seller: seller,
            pic: profilePic
        })
        genarateJwtToken(newUser._id, res)
        await newUser.save()

        const cart = new cartModel({ userId: newUser._id, items: [] })
        await cart.save()

        res.status(200).json({
            message: "success",
            id: newUser._id,
            username: newUser.username,
            name: newUser.name,
            phno: newUser.phno,
            email: newUser.email,
            pic: newUser.pic
        })
    } catch (error) {
        console.log("problem in User Register ", error)
        res.status(500).json({ error: "Internal Server Error" });
    }
}

export const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) return res.status(500).json({ error: "No Username and Password " })

        const User = await user.findOne({ username })

        if (!User) {
            return res.status(404).json({ error: "No user found " })
        }

        const isMatch = await bcrypt.compare(password, User.password);
        if (!isMatch) return res.status(400).json({ error: "Incorrect Password" });

        let token = await genarateJwtToken(User._id, res)


        res.status(200).json({
            message: "success",
            id: User._id,
            username: User.username,
            name: User.name,
            phno: User.phno,
            email: User.email,
            pic: User.pic,
            token: token
        })
    } catch (error) {
        console.log("problem in User Login ", error)
        res.status(500).json({ error: "Internal Server Error" });
    }
}
export const sellerregister = async (req, res) => {
    try {
        const { username, password, email, phno, companyname, pic } = req.body;

        if (!username || !password || !email || !companyname || !phno) return res.status(500).json({ error: "All Fields Required" })

        if (await seller.findOne({ username })) return res.status(500).json({ error: "Username Already Exist" })
        if (await seller.findOne({ email })) return res.status(500).json({ error: "Email Already Exist" })
        if (await seller.findOne({ phno })) return res.status(500).json({ error: "Phone Number Already Exist" })

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newSeller = new seller({
            username: username,
            password: hashedPassword,
            email: email,
            phno: phno,
            companyname: companyname,
            pic: pic
        })
        genarateJwtToken(newSeller._id, res)
        await newSeller.save()

        res.status(200).json({
            message: "success",
            id: newSeller._id,
            username: newSeller.username,
            companyname: newSeller.companyname,
            phno: newSeller.phno,
            email: newSeller.email
        })

    } catch (error) {
        console.log("problem in Seller Register ", error)
        res.status(500).json({ error: "Internal Server Error" });
    }
}

export const sellerlogin = async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) return res.status(500).json({ error: "No Username and Password " })

        const Seller = await seller.findOne({ username })

        if (!Seller) {
            return res.status(404).json({ error: "No Seller found " })
        }

        const isMatch = await bcrypt.compare(password, Seller.password);
        if (!isMatch) return res.status(400).json({ error: "Incorrect Password" });

        let token = await genarateJwtToken(Seller._id, res)


        res.status(200).json({
            message: "success",
            id: Seller._id,
            username: Seller.username,
            companyname: Seller.companyname,
            phno: Seller.phno,
            email: Seller.email,
            pic: Seller.pic,
            token: token
        })

    } catch (error) {
        console.log("problem in Seller Login ", error)
        res.status(500).json({ error: "Internal Server Error" });
    }
}

export const logout = (req, res) => {
    res.clearCookie("jwt").json({ message: "Loggedout " })
}

export const allProducts = async (req, res) => {
    try {
        const allPro = await productModel.find().populate("seller", "companyname");
        res.status(200).json({ message: "success", product: allPro })
    } catch (error) {
        console.log("problem in All products ", error)
        res.status(500).json({ error: "Internal Server Error" })
    }
};
export const product = async (req, res) => {
    try {
        let proid = req.params.id;
        const pro = await productModel.findById(proid).populate("seller", "companyname");
        res.status(200).json({ message: "success", product: pro })
    } catch (error) {
        console.log("problem in get products ", error)
        res.status(500).json({ error: "Internal Server Error" })
    }
}

export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await userModel.findOne({ email });

        if (!user) return res.status(404).json({ message: "User not found" });

        const resetToken = crypto.randomBytes(32).toString("hex");
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = Date.now() + 15 * 60 * 1000;

        const resetLink = `https://agritrade-three.vercel.app/reset-password?token=${resetToken}`;

        const emailData = {
            email: user.email,
            subject: "Password Reset Request",
            text: `Click the link to reset your password:\n\n${resetLink}\n\nThis link expires in 15 minutes.`
        };

        sendMails({ body: emailData }, { status: () => ({ json: () => { } }) });

        res.status(200).json({ message: "Password reset link sent to your email" });
    } catch (error) {
        console.error("Forgot Password Error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

export const resetPassword = async (req, res) => {
    try {
        const { token, newPassword } = req.body;
        const user = await userModel.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() } 
        });

        if (!user) return res.status(400).json({ message: "Invalid or expired token" });

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);

        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        res.status(200).json({ message: "Password has been reset successfully" });
    } catch (error) {
        console.error("Reset Password Error:", error);
        res.status(500).json({ message: "Server error" });
    }
};
