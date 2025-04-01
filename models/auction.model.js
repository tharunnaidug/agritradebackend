import mongoose from "mongoose";
import Bid from "../models/bid.model.js"; 

const auctionSchema = mongoose.Schema({
    seller: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    product: { type: String, required: true },
    imgSrc: { type: [String] },
    description: { type: String },
    baseBid: { type: Number, default: 0 },
    bids: [{ type: mongoose.Schema.Types.ObjectId, ref: "Bid", default: [] }],
    status: { type: String, default: "Not Approved" },
    auctionDateTime: { type: Date, required: true },
    interestedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User", default: [] }],
    highestBid: { type: Number, default: 0 },
    highestBidder: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    comment: { type: String },
    state: { type: String },
    payment: { type: String },
    unit: { type: String, default: "Kg" },
    qty: { type: Number, required: true }
}, { timestamps: true });

const Auction = mongoose.model("Auction", auctionSchema);

export default Auction;