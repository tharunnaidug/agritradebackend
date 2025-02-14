import mongoose from "mongoose";


const cartItemSchema = new mongoose.Schema({
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    title: { type: String, required: true },
    price: { type: Number, default: 0 },
    qty: { type: Number, default: 0 },
    imgSrc: { type: String, required: true },
})

const cartSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: [cartItemSchema],
    createdAt: { type: Date, default: Date.now() }
}, { timestamps: true });

export default mongoose.model('Cart', cartSchema);