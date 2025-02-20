import cartModel from "../models/cart.model.js";
import user from "../models/user.model.js";
import genarateJwtToken from "../utills/genarateJwt.js";
import productModel from "../models/product.model.js";

export const index = async (req, res) => {
    res.send("Welcome to AgriTrade Backend !!!")
}

export const register = async (req, res) => {
    try {
        const { username, password, email, phno, name, dob, gender, seller } = req.body;

        if (!username || !password || !email || !name || !phno) return res.status(500).json({ error: "All Fields Required" })

        if (await user.findOne({ username })) return res.status(500).json({ error: "Username Already Exist" })
        if (await user.findOne({ email })) return res.status(500).json({ error: "Email Already Exist" })
        if (await user.findOne({ phno })) return res.status(500).json({ error: "Phone Number Already Exist" })

        const newUser = new user({
            username: username,
            password: password,
            email: email,
            phno: phno,
            name: name,
            dob: dob,
            gender: gender,
            seller: seller
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
            email: newUser.email
        })
    } catch (error) {
        console.log("problem in Register ", error)
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
        if (User?.password != password) {
            return res.status(500).json({ error: "Incorrect Password " })
        }
        let token = await genarateJwtToken(User._id, res)


        res.status(200).json({
            message: "success",
            id: User._id,
            username: User.username,
            name: User.name,
            phno: User.phno,
            email: User.email,
            token: token
        })
    } catch (error) {
        console.log("problem in Login ", error)
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