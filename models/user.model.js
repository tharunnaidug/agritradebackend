import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
    username: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    email: { type: String, unique: true },
    name: { type: String },
    phno: { type: Number, unique: true },
    gender: { type: String, default: "male" },
    pic: { type: String, default: "https://i.ibb.co/B5dhy2XB/free-user-icon-3296-thumb.png" },
    seller: { type: Boolean, default: false },
    dob: Date,
}, { timestamps: true })

const user = mongoose.model("User", userSchema);

export default user;