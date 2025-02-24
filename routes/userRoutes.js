import express, { Router } from "express"
import { verify } from "jsonwebtoken";
import { address, allOrder, cancelorder, checkout, order, profile, updateAdd } from "../controllers/user.controllers";

const router=express.Router();

router.get('/profile/:username',verify,profile);

router.get('/address', verify, address)

router.get('/order', verify, allOrder)

router.get('/order/:id', verify, order)

router.get('/order/cancel/:id', verify, cancelorder)

// Post routes
router.post('/checkout', verify, checkout)

router.post('/address/update', verify, updateAdd)

export default router;