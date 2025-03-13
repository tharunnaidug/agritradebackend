import cartModel from "../models/cart.model.js";
import user from "../models/user.model.js";
import seller from "../models/seller.model.js";
import genarateJwtToken from "../utills/genarateJwt.js";
import productModel from "../models/product.model.js";
import bcrypt from "bcrypt";

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
    res.clearCookie("jwt").json({ message: "loggedout" })
}

export const allProducts = async (req, res) => {
    try {
        const allPro = await productModel.find()
        res.status(200).json({ message: "success", product: allPro })
    } catch (error) {
        console.log("problem in All products ", error)
        res.status(500).json({ error: "Internal Server Error" })
    }
};
export const product = async (req, res) => {
    try {
        let proid = req.params.id;
        const pro = await productModel.findById(proid)
        res.status(200).json({ message: "success", product: pro })
    } catch (error) {
        console.log("problem in get products ", error)
        res.status(500).json({ error: "Internal Server Error" })
    }
}