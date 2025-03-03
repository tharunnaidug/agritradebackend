import auctionModel from '../models/auction.model.js';
import sellerModel from '../models/seller.model.js';
import userModel from '../models/user.model.js';

export const allMyAuctions = async (req, res) => {
    let userId = req.user._id;

    if (!userId)
        return res.status(401).json({ error: "No UserId Found" })
    try {
        const pastAuctions = await Auction.find({
            auctionDateTime: { $lt: new Date() },
            bids: { $in: [userId] }
        });

        const upcomingAuctions = await Auction.find({
            auctionDateTime: { $gt: new Date() },
            bids: { $in: [userId] }
        });

        return res.status(200).json({ message: "success", pastAuctions, upcomingAuctions })
    } catch (error) {
        console.log("problem in Getting All listed Auctions ", error)
        res.status(500).json({ error: "Internal Server Error" })
    }
}
export const allMyListedAuctions = async (req, res) => {
    let userId = req.user._id;

    if (!userId)
        return res.status(401).json({ error: "No UserId Found" })
    try {
        const pastAuctions = await Auction.find({
            auctionDateTime: { $lt: new Date() },
            seller: userId
        });

        const upcomingAuctions = await Auction.find({
            auctionDateTime: { $gt: new Date() },
            seller: userId
        });

        return res.status(200).json({ message: "success", pastAuctions, upcomingAuctions })
    } catch (error) {
        console.log("problem in Getting All listed Auctions ", error)
        res.status(500).json({ error: "Internal Server Error" })
    }
}
export const viewAuction = async (req, res) => {
    try {
        let aucId = req.params.id;
        const auction = await auctionModel.findById(aucId).populate("seller", "name").populate("bids");
        if (!auction) return res.status(404).json({ message: "Auction not found" });
        return res.status(200).json({ message: "success", auction })
    } catch (error) {
        console.log("problem in Getting A Auction ", error)
        res.status(500).json({ error: "Internal Server Error" });
    }
}
export const upcomingAuctions = async (req, res) => {
    try {

        const upcomingAuctions = await Auction.find({
            auctionDateTime: { $gt: new Date() }
        });
        return res.status(200).json({ message: "success", upcomingAuctions })
    } catch (error) {
        console.log("problem in Getting Upcoing Auctions ", error)
        res.status(500).json({ error: "Internal Server Error" })
    }
}
export const addAuction = async (req, res) => {
    let userId = req.user._id;

    const user = await userModel.findById(userId)

    if (!user)
        return res.status(401).json({ error: "No UserId Found" })
    const { product, imgSrc, description, baseBid, auctionDateTime } = req.body;
    if (product || imgSrc || description || baseBid || auctionDateTime) {
        return res.status(404).json({ error: "Incomplete Information" })
    }
    try {
        const newAuc = new auctionModel({
            seller: userId,
            product: product,
            imgSrc: imgSrc,
            description: description,
            baseBid: baseBid,
            status: "Not Approved",
            auctionDateTime: auctionDateTime
        })
        await newAuc.save();

        return res.status(200).json({ message: "success", newAuc })

    } catch (error) {
        console.log("problem in Adding  Auction by User ", error)
        res.status(500).json({ error: "Internal Server Error" });
    }
}
export const interested = async (req, res) => {
    let userId = req.user._id;
    const { auctionId } = req.body;

    if (!userId)
        return res.status(401).json({ error: "No UserId Found" })

    try {
        const auction = await auctionModel.findById(auctionId);
        if (!auction) return res.status(404).json({ error: "Auction not found" });

        if (!auction.interestedUsers.includes(userId)) {
            auction.interestedUsers.push(userId);
            await auction.save();
        }

        res.status(200).json({ message: "success", auction });
    } catch (error) {
        console.log("problem in Interested User Adding ", error)
        res.status(500).json({ error: "Internal Server Error" });
    }
}
export const placeBid = async (req, res) => {
    const { auctionId, bidAmount } = req.body;
    const userId = req.user._id;

    if (!auctionId || !bidAmount) {
        return res.status(400).json({ error: "Auction ID and bid amount are required" });
    }
    
    const user = await userModel.findById(userId)
    if (!user) return res.status(400).json({ error: "user not found" });
    
    try {
        const auction = await auctionModel.findById(auctionId);
        if (!auction) {
            return res.status(404).json({ error: "Auction not found" });
        }

        const newBid = new bidModel({
            auctionId,
            bidder: userId,
            bid: bidAmount
        });

        await newBid.save();

        auction.bids.push(newBid._id);
        await auction.save();

        const io = req.app.get("io");
        io.to(auctionId).emit("newBid", {
            auctionId,
            bidAmount,
            bidder: user.username
        });

        res.status(200).json({ message: "success", bid: newBid });
    } catch (error) {
        console.log("Problem in placing bid:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}