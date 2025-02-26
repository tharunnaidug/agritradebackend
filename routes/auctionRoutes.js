import express, { Router } from "express"
import { verifyUser } from "../middlewares/isLoggedIn.js";
import { allMyListedAuctions } from "../controllers/auction.controllers.js";

const router=express.Router();

router.get('/allMyListedAuctions',verifyUser,allMyListedAuctions)

export default router;