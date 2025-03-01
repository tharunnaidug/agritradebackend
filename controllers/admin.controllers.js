import user from "../models/user.model.js";
import productModel from "../models/product.model.js";
import orderModel from "../models/order.model.js";

export const allUsers = async (req, res) => {
    try {
        const users = await user.find()

        res.status(200).json({ message: "success", users: users })

    } catch (error) {
        console.log("problem in All Users ", error)
        res.status(500).json({ error: "Internal Server Error" })
    }
}

export const allOrders = async (req, res) => {
    try {
        const orders = await orderModel.find()

        res.status(200).json({ message: "success", orders: orders })

    } catch (error) {
        console.log("Problem in All Orders Admin ", error)
        res.status(500).json({ error: "Internal Server Error" })
    }
}

export const allAuction = async (req, res) => {

}
export const allSellers = async (req, res) => {

}
export const allProducts = async (req, res) => {

    try {
        const products = await productModel.find()

        res.status(200).json({ message: "success", products: products })

    } catch (error) {
        console.log("Problem in All Products Admin ", error)
        res.status(500).json({ error: "Internal Server Error" })
    }
}

export const updateAuction = async (req, res) => {

}
export const updateProduct = async (req, res) => {

}
export const updateUser = async (req, res) => {

}
export const updateSeller = async (req, res) => {

}
export const updateOrder = async (req, res) => {

}