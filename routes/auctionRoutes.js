import express, { Router } from "express"
import { verifyUser } from "../middlewares/isLoggedIn";
import { allMyListedAuctions } from "../controllers/auction.controllers";

const router=express.Router();

router.get('/allMyListedAuctions',verifyUser,allMyListedAuctions)

export default router;