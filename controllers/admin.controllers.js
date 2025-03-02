import userModel from "../models/user.model.js";
import productModel from "../models/product.model.js";
import orderModel from "../models/order.model.js";
import auctionModel from "../models/auction.model.js";
import sellerModel from "../models/seller.model.js";

export const allUsers = async (req, res) => {
    try {
        const users = await userModel.find().select("-password")

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
    try {
        const auctions = await auctionModel.find()

        res.status(200).json({ message: "success", auctions: auctions })

    } catch (error) {
        console.log("Problem in All Auctions Admin ", error)
        res.status(500).json({ error: "Internal Server Error" })
    }
}
export const allSellers = async (req, res) => {
    try {
        const sellers = await sellerModel.find().select("-password")

        res.status(200).json({ message: "success", sellers: sellers })

    } catch (error) {
        console.log("Problem in All Sellers Admin ", error)
        res.status(500).json({ error: "Internal Server Error" })
    }
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
export const newAuction = async (req, res) => {
    try {
        const auctions = await auctionModel.find({ status: "Not Approved" })

        res.status(200).json({ message: "success", auctions: auctions })

    } catch (error) {
        console.log("Problem in New Auctions Admin ", error)
        res.status(500).json({ error: "Internal Server Error" })
    }
}

export const updateAuction = async (req, res) => {
    const aucId = req.params.id;

    const { seller, product, description, baseBid, status, auctionDateTime } = req.body;

    if (!product || !description || !baseBid || !status || !auctionDateTime)
        return res.status(404).json({ error: "Incompelete Information" })

    try {
        const auc = await auctionModel.findById(aucId)
        if (!auc)
            return res.status(404).json({ error: "Auction Not found" })

        auc.seller = seller;
        auc.product = product;
        auc.description = description;
        auc.baseBid = baseBid;
        auc.status = status;
        auc.auctionDateTime = auctionDateTime;

        await auc.save();

        res.status(200).json({ message: "success", auction: auc })
    } catch (error) {
        console.log("Problem in Update Auction Admin ", error)
        res.status(500).json({ error: "Internal Server Error" })
    }
}
export const updateProduct = async (req, res) => {
    const proId = req.params.id;
    const { title, description, category, price, qty } = req.body;
    if (!title || !description || !category || !price || !qty)
        return res.status(404).json({ error: "Incompelete Information" })
    try {
        const pro = await productModel.findById(proId)
        if (!pro)
            return res.status(404).json({ error: "No Product Found" })

        pro.title = title;
        pro.description = description;
        pro.price = price;
        pro.category = category;
        pro.qty = qty;

        await pro.save();

        res.status(200).json({ message: "success", product: pro })
    } catch (error) {
        console.log("Problem in UpdateProduct Admin ", error)
        res.status(500).json({ error: "Internal Server Error" })
    }
}
export const updateUser = async (req, res) => {
    const usId = req.params.id;
    const { username, email, name, phno, gender, seller } = req.body;
    if (!username || !email || !name || !phno || !gender || !seller)
        return res.status(404).json({ error: "Incompelete Information" })
    try {
        const user = await userModel.findById(usId)
        if (!user)
            return res.status(404).json({ error: "User Not FOund" })

        user.username = username;
        user.email = email;
        user.name = name;
        user.phno = phno;
        user.gender = gender;
        user.seller = seller;

        await user.save();

        res.status(200).json({ message: "success", user })
    } catch (error) {
        console.log("Problem in Admin ", error)
        res.status(500).json({ error: "Internal Server Error" })
    }
}
export const updateSeller = async (req, res) => {
    const sellerId = req.params.id;
    const { username, email, companyname, phno } = req.body;
    if (!username || !email || !companyname || !phno)
        return res.status(404).json({ error: "Incompelete Information" })
    try {
        const seller = await sellerModel.findById(sellerId);
        if (!seller)
            return res.status(404).json({ error: "Seller not found" })

        seller.username = username;
        seller.email = email;
        seller.companyname = companyname;
        seller.phno = phno;

        await seller.save();

        res.status(200).json({ message: "success", seller });

    } catch (error) {
        console.log("Problem in UpadateSeller Admin ", error)
        res.status(500).json({ error: "Internal Server Error" })
    }
}
export const updateOrder = async (req, res) => {
    const orderId = req.params.id;
    const { status, payment } = req.body;

    try {
        const order = await orderModel.findById(orderId);
        if (!order) {
            return res.status(404).json({ error: "Order not found" });
        }

        order.status = status;
        order.payment = payment;

        await order.save();

        res.status(200).json({ message: "success", order });
    } catch (error) {
        console.log("Problem in Update Order Admin ", error)
        res.status(500).json({ error: "Internal Server Error" })
    }
}