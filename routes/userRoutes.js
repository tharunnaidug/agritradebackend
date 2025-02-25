import express, { Router } from "express"
import { verify } from "jsonwebtoken";
import { addQty, address, addToCart, allOrder, cancelorder, cart, checkout, clearCart, order, profile, removeQty, updateAdd } from "../controllers/user.controllers.js";

const router = express.Router();

router.get('/profile/:username', verify, profile);

router.get('/address', verify, address)

router.get('/order', verify, allOrder)

router.get('/order/:id', verify, order)

router.get('/order/cancel/:id', verify, cancelorder)

router.get('/cart', verify, cart)

router.get('/cart/clear', verify, clearCart)

// Post routes
router.post('/checkout', verify, checkout)

router.post('/address/update', verify, updateAdd)

router.post('/cart/add', verify, addToCart)

router.post('cart/update', verify,)

router.post('/cart/addQty', verify, addQty)

router.post('/cart/removeQty', verify, removeQty)

export default router;