import express from "express"
import { checkout, verifyPayment } from "../utills/payment.js";


const router=express.Router();

router.post("/checkout",checkout);

router.post("/verifyPayment",verifyPayment);

export default router;