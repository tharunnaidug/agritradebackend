import express, { Router } from "express"
import { verifyUser } from "../middlewares/isLoggedIn.js";
import { addAuction, allMyListedAuctions, upcomingAuctions, viewAuction } from "../controllers/auction.controllers.js";

const router=express.Router();

router.get('/allMyListedAuctions',verifyUser,allMyListedAuctions)

router.get('/auction/:id',verifyUser,viewAuction)

router.get('/upcomingAuctions',verifyUser,upcomingAuctions)

//post Routes
router.post('/addAuction',verifyUser,addAuction)


export default router;