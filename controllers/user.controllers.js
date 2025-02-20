import user from "../models/user.model.js";
import orderModel from "../models/order.model.js";
import addressModel from "../models/address.model.js";


export const profile = async (req, res) => {

    try {
        let username = req.params.username;
        const User = await user.findOne({ username })
        if (!User) return res.status(404).json({ error: "No user found" })

        const address = await addressModel.findOne({ userId: User._id })
        const orders = await orderModel.find({ userId: User._id })

        res.status(200).json({
            id: User._id,
            username: User.username,
            name: User.name,
            phno: User.phno,
            email: User.email,
            address: address,
            orders: orders
        })


    } catch (error) {
        console.log("problem in Getting profile ", error)
        res.status(500).json({ error: "Internal Server Error" })
    }
};