import seller from "../models/seller.model.js";
import orderModel from "../models/order.model.js";
import productModel from "../models/product.model.js";


export const profile = async (req, res) => {

    try {
        let username = req.params.username;
        const Seller = await seller.findOne({ username })
        if (!Seller) return res.status(404).json({ error: "No Seller found" })

        const products = await productModel.findOne({ sellerId: Seller._id })
        const orders = await orderModel.find({ sellerId: Seller._id })

        res.status(200).json({
            id: Seller._id,
            username: Seller.username,
            companyname: Seller.companyname,
            phno: Seller.phno,
            email: Seller.email,
            products: products,
            orders: orders
        })


    } catch (error) {
        console.log("problem in Getting profile ", error)
        res.status(500).json({ error: "Internal Server Error" })
    }
}