import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    title: { type: String, required: true },
    price: { type: Number, default: 0 },
    qty: { type: Number, default: 0 },
    imgSrc: { type: String },
})

const orderSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: [orderItemSchema],
    address: { type: mongoose.Schema.Types.ObjectId, ref: "Address", required: true },
    payment: { type: String, default: "COD" },
    total: { type: Number, default: 0 },
    status: { type: String, default: "Placed" },
    createdAt: { type: Date, default: Date.now() }
}, { timestamps: true })

export default mongoose.model('Order', orderSchema)