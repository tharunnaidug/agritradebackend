import auctionModel from '../models/auction.model.js';
import sellerModel from '../models/seller.model.js';
import userModel from '../models/user.model.js';
import bidModel from '../models/bid.model.js';

export const allMyAuctions = async (req, res) => {
    let userId = req.user._id;

    if (!userId) {
        return res.status(401).json({ error: "No UserId Found" });
    }

    try {
        const pastAuctions = await auctionModel.find({
            auctionDateTime: { $lt: new Date() }
        })
            .populate({
                path: "bids",
                match: { bidder: userId }
            })
            .then(auctions => auctions.filter(auction => auction.bids.length > 0));

        const upcomingAuctions = await auctionModel.find({
            auctionDateTime: { $gt: new Date() },
            interestedUsers: userId
        });

        const liveAuctions = await auctionModel.find({
            status: "Live"
        })
            .populate({
                path: "bids",
                match: { bidder: userId }
            })
            .then(auctions => auctions.filter(auction =>
                auction.bids.length > 0 || auction.interestedUsers.includes(userId)
            ));


        return res.status(200).json({ message: "success", pastAuctions, upcomingAuctions, liveAuctions });
    } catch (error) {
        console.log("Problem in getting all listed auctions", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const allMyListedAuctions = async (req, res) => {
    let userId = req.user._id;

    if (!userId)
        return res.status(401).json({ error: "No UserId Found" })
    try {
        const pastAuctions = await auctionModel.find({
            auctionDateTime: { $lt: new Date() },
            seller: userId
        });

        const upcomingAuctions = await auctionModel.find({
            auctionDateTime: { $gt: new Date() },
            seller: userId
        });
        const liveAuctions = await auctionModel.find({
            status: "Live",
            seller: userId
        });

        return res.status(200).json({ message: "success", pastAuctions, upcomingAuctions, liveAuctions })
    } catch (error) {
        console.log("problem in Getting All listed Auctions ", error)
        res.status(500).json({ error: "Internal Server Error" })
    }
}
export const viewAuction = async (req, res) => {
    try {
        let aucId = req.params.id;
        const auction = await auctionModel
            .findById(aucId)
            .populate("seller", "name")
            .populate({
                path: "bids",
                populate: {
                    path: "bidder",
                    select: "name",
                },
            })
            .populate("highestBidder", "name");
        if (!auction) return res.status(404).json({ message: "Auction not found" });
        return res.status(200).json({ message: "success", auction })
    } catch (error) {
        console.log("problem in Getting A Auction ", error)
        res.status(500).json({ error: "Internal Server Error" });
    }
}
export const viewAuctionInfo = async (req, res) => {
    try {
        let aucId = req.params.id;
        const auction = await auctionModel
            .findById(aucId)
            .populate("seller", "name")
            .populate({
                path: "bids",
                populate: {
                    path: "bidder",
                    select: "name",
                },
            })
            .populate("highestBidder", "name");
        if (!auction) return res.status(404).json({ message: "Auction not found" });
        return res.status(200).json({ message: "success", auction })
    } catch (error) {
        console.log("problem in Getting A Auction Info ", error)
        res.status(500).json({ error: "Internal Server Error" });
    }
}
export const upcomingAuctions = async (req, res) => {
    try {

        const upcomingAuctions = await auctionModel.find({
            auctionDateTime: { $gt: new Date() },
            status: "Scheduled"
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
    const { product, images, description, baseBidPrice, auctionDateTime, additionalInfo, state, paymentMode, quantity, unit } = req.body;
    if (!product || !images || !description || !baseBidPrice || !auctionDateTime) {
        return res.status(404).json({ error: "Incomplete Information" })
    }
    try {
        const newAuc = new auctionModel({
            seller: userId,
            product: product,
            imgSrc: images,
            description: description,
            baseBid: baseBidPrice,
            status: "Not Approved",
            auctionDateTime: auctionDateTime,
            comment: additionalInfo,
            state: state,
            payment: paymentMode,
            qty: quantity,
            unit: unit
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

    const user = await userModel.findById(userId);
    if (!user) return res.status(400).json({ error: "User not found" });

    try {
        const auction = await auctionModel.findById(auctionId)

        if (!auction) {
            return res.status(404).json({ error: "Auction not found" });
        }

        const currentHighestBid = auction.highestBid || (auction.baseBid - 0.01);

        if (bidAmount <= currentHighestBid) {
            return res.status(400).json({ error: "Bid must be higher than the current highest bid" });
        }

        const newBid = new bidModel({
            auctionId,
            bidder: userId,
            bidderName: user.name,
            bid: bidAmount
        });

        await newBid.save();

        auction.bids.push(newBid._id);
        auction.highestBid = bidAmount;
        auction.highestBidder = userId;
        await auction.save();

        const io = req.app.get("io");
        io.to(auctionId).emit("newBid", {
            auctionId,
            bidAmount,
            bidder: user.name,
            highestBid: bidAmount
        });

        res.status(200).json({ message: "success", bid: newBid });
    } catch (error) {
        console.log("Problem in placing bid:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const liveAuctions = async (req, res) => {
    try {

        const liveAuc = await auctionModel.find({
            status: "Live"
        });
        return res.status(200).json({ message: "success", liveAuc })
    } catch (error) {
        console.log("problem in Getting Live Auctions ", error)
        res.status(500).json({ error: "Internal Server Error" })
    }
}
export const allAuctions = async (req, res) => {

    try {
        const pastAuctions = await auctionModel.find({
            auctionDateTime: { $lt: new Date() }
        });

        const upcomingAuctions = await auctionModel.find({
            auctionDateTime: { $gt: new Date() }
        });

        const liveAuctions = await auctionModel.find({
            status: "Live"
        });

        return res.status(200).json({ message: "success", pastAuctions, upcomingAuctions, liveAuctions });
    } catch (error) {
        console.log("Problem in getting all auctions for admin", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
export const updateAuction = async (req, res) => {
    const { auctionId, product, description, baseBid, auctionDateTime, additionalInfo, state, payment, status } = req.body;
    if (!auctionId || !product || !description || !baseBid || !auctionDateTime || !status) {
        return res.status(404).json({ error: "Incomplete Information" })
    }

    try {
        const auction = await auctionModel.findById(auctionId);
        if (!auction) {
            return res.status(404).json({ error: "Auction not found" });
        }

        auction.product = product,
            auction.description = description,
            auction.baseBid = baseBid,
            auction.status = status,
            auction.auctionDateTime = auctionDateTime,
            auction.comment = additionalInfo,
            auction.state = state,
            auction.payment = payment

        await auction.save();

        return res.status(200).json({ message: "success", auction })

    } catch (error) {
        console.log("problem in Updating Auction by Admin ", error)
        res.status(500).json({ error: "Internal Server Error" });
    }
}