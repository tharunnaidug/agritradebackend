import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: Number, default: 0 },
    qty: { type: Number, default: 0 },
    imgSrc: { type: [String], required: true },
    seller:{type:mongoose.Schema.ObjectId, ref: "Seller"},
    createdAt: { type: Date, default: Date.now() }
}, { timestamps: true });

export default mongoose.model('Product', productSchema);