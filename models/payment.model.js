import mongoose from "mongoose";


const paymentSchema = new mongoose.Schema({
    orderDate: { type: Date,default:Date.now() },
    paymentStatus: { type: String},
}, { timestamps: true,strict:false });


export default mongoose.model("Payment", paymentSchema)