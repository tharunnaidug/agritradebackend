import mongoose from "mongoose";

const bidSchema = mongoose.Schema({
    auctionId: { type: mongoose.Schema.Types.ObjectId, ref: "Auction", index: true, required: true },
    bidder: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    bid: { type: Number, },
    bidTime: { type: Date, default: Date.now() }
}, { timestamps: true })

const Bid = mongoose.model("Bid", bidSchema)

export default Bid;