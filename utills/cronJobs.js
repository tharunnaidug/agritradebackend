import cron from "node-cron";
import auctionModel from "../models/auction.model.js";
import userModel from "../models/user.model.js";
import { getIO } from "./webSockets.js";
import { sendMails } from "./sendEmails.js";

const startAuctions = async () => {
    try {
        const now = new Date();
        const auctionsToStart = await auctionModel.find({
            auctionDateTime: { $lte: now },
            status: "Scheduled"
        }).populate("interestedUsers");

        const io = getIO();

        for (const auction of auctionsToStart) {
            auction.status = "Live";
            await auction.save();

            io.to(auction._id.toString()).emit("auctionStarted", {
                auctionId: auction._id,
                message: `Auction for ${auction.product} has started!`
            });

            console.log(`Auction ${auction._id} has started.`);
        }
        for (const auc of auctionsToStart) {
            for (const user of auc.interestedUsers) {
                io.to(user._id.toString()).emit("auctionStarted", {
                    auctionId: auc._id,
                    message: `Reminder: Auction for ${auc.product} has started!`
                });
                
                const emailData = {
                    email: user.email,
                    subject: `Upcoming Auction: ${auc.product}`,
                    text: `Hello ${user.username},\n\nThis is a reminder that the auction for "${auc.product}" has started !!\n\nJoin the auction now! \n\n Regards,\nTeam Agritrade`
                };

                sendMails({ body: emailData }, { 
                    status: () => ({ json: () => {} })
                });
                console.log(`Notification sent to ${user.username} for auction ${auc._id}`);
            }
        }
    } catch (error) {
        console.error("Error in startAuctions cron job:", error);
    }
};

const notifyInterestedUsers = async () => {
    try {
        const now = new Date();
        const thirtyMinutesLater = new Date(now.getTime() + 30 * 60000); 

        const upcomingAuctions = await auctionModel.find({
            auctionDateTime: { $gte: now, $lte: thirtyMinutesLater }
        }).populate("interestedUsers");

        const io = getIO();

        for (const auction of upcomingAuctions) {
            for (const user of auction.interestedUsers) {
                if (auction.notifiedUsers.includes(user._id)) {
                    continue;
                }

                io.to(user._id.toString()).emit("auctionReminder", {
                    auctionId: auction._id,
                    message: `Reminder: Auction for ${auction.product} starts in 30 minutes!`
                });

                const emailData = {
                    email: user.email,
                    subject: `Upcoming Auction: ${auction.product}`,
                    text: `Hello ${user.username},\n\nThis is a reminder that the auction for "${auction.product}" will start in 30 minutes.\n\nJoin the auction now! \n\n Regards,\nTeam Agritrade`
                };

                sendMails({ body: emailData }, { 
                    status: () => ({ json: () => {} })
                });

                console.log(`Notification sent to ${user.username} for auction ${auction._id}`);

                auction.notifiedUsers.push(user._id);
            }
            await auction.save(); 
        }
    } catch (error) {
        console.error("Error in notifyInterestedUsers cron job:", error);
    }
};


cron.schedule("* * * * *", startAuctions);
cron.schedule("* * * * *", notifyInterestedUsers);

console.log("Cron jobs scheduled: Start Auctions & Notify Interested Users");

export { startAuctions, notifyInterestedUsers };
