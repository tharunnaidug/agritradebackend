import mongoose from 'mongoose'

const sellerSchema = new mongoose.Schema({
    username: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    email: { type: String, unique: true },
    companyname: { type: String },
    phno: { type: Number, unique: true },
    pic: { type: String, default: " " }
}, { timestamps: true })

const seller = mongoose.model("Seller", sellerSchema);

export default seller;