import express, { Router } from "express"
import { verifyUser } from "../middlewares/isLoggedIn.js";
import { addAuction, allAuctions, allMyAuctions, allMyListedAuctions, interested, liveAuctions, placeBid, upcomingAuctions, updateAuction, viewAuction, viewAuctionInfo } from "../controllers/auction.controllers.js";

const router=express.Router();

router.get('/allMyListedAuctions',verifyUser,allMyListedAuctions)

router.get('/allMyAuctions',verifyUser,allMyAuctions)

router.get('/auction/:id',viewAuctionInfo)

router.get('/auction/view/:id',verifyUser,viewAuction)

router.get('/upcomingAuctions',verifyUser,upcomingAuctions)

router.get('/liveAuctions',verifyUser,liveAuctions)

router.get('/admin/allAuctions',allAuctions)

//post Routes
router.post('/addAuction',verifyUser,addAuction)


router.post('/interested',verifyUser,interested)

router.post('/placeBid',verifyUser,placeBid)

router.post('/admin/updateauction',updateAuction)

export default router;