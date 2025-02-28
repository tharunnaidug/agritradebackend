import auctionModel from '../models/auction.model.js';

export const allMyListedAuctions = async (req, res) => {
    let userId = req.user._id;

    if (!userId)
        return res.status(401).json({ error: "No UserId Found" })
    try {
        const pastAuctions = await Auction.find({
            auctionDateTime: { $lt: new Date() },
            $or: [{ seller: userId }, { bids: { $in: [userId] } }]
        });

        const upcomingAuctions = await Auction.find({
            auctionDateTime: { $gt: new Date() },
            $or: [{ seller: userId }, { bids: { $in: [userId] } }]
        });

        return res.status(200).json({ message: "success", pastAuctions,upcomingAuctions })
    } catch (error) {
        console.log("problem in Getting All listed Auctions ", error)
        res.status(500).json({ error: "Internal Server Error" })
    }
}
export const viewAuction=async(req,res)=>{
    try {
        let aucId=req.params.id;
        const auction = await auctionModel.findById(aucId).populate("seller", "name").populate("bids");
        if (!auction) return res.status(404).json({ message: "Auction not found" });
        return res.status(200).json({ message: "success", auction })
    } catch (error) {
        console.log("problem in Getting A Auction ", error)
        res.status(500).json({ error:"Internal Server Error" });
    }
}