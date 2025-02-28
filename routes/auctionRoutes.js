import express, { Router } from "express"
import { verifyUser } from "../middlewares/isLoggedIn.js";
import { allMyListedAuctions, viewAuction } from "../controllers/auction.controllers.js";

const router=express.Router();

router.get('/allMyListedAuctions',verifyUser,allMyListedAuctions)

router.get('/auction/:id',verifyUser,viewAuction)

export default router;