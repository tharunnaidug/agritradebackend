import mongoose from 'mongoose'

const sellerSchema = new mongoose.Schema({
    username: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    email: { type: String, unique: true },
    companyname: { type: String },
    phno: { type: Number, unique: true },
    pic: { type: String, default: "https://i.ibb.co/B5dhy2XB/free-user-icon-3296-thumb.png" },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date }
}, { timestamps: true })

const seller = mongoose.model("Seller", sellerSchema);

export default seller;