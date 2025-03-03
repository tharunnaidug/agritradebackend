import mongoose from "mongoose";

const auctionSchema = mongoose.Schema({
    seller: {
        type: mongoose.Schema.Types.ObjectId, ref: "User", required: true
    },
    product: {
        type: String
    },
    imgSrc: {
        type: [String]
    },
    description: {
        type: String
    },
    baseBid: {
        type: Number, default: 0
    },
    bids: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Bid",
            default: []
        }
    ],
    status: {
        type: String,
        default: "Not Approved"
    },
    auctionDateTime: {
        type: Date
    },
    interestedUsers: [
        {
            type: mongoose.Schema.Types.ObjectId, ref: "User", default: []

        }
    ],
    highestBid: {
        type: Number
    }
}, { timestamps: true })

const Auction = mongoose.model("Auction", auctionSchema)

export default Auction;