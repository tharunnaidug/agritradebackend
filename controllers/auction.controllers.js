import auctionModel from '../models/auction.model.js';

export const allMyListedAuctions = async (req, res) => {
    let userId = req.user._id;

    if (!userId)
        return res.status(401).json({ error: "No UserId Found" })
    try {
        let auctions = auctionModel.find({ seller: userId })

        return res.status(200).json({ message: "success", auctions })
    } catch (error) {
        console.log("problem in Getting All listed Auctions ", error)
        res.status(500).json({ error: "Internal Server Error" })
    }
}