import express, { Router } from "express"
import { addQty, address, addToCart, allOrder, cancelorder, cart, checkout, clearCart, order, placeOrder, profile, removeQty, updateAdd, updateUser } from "../controllers/user.controllers.js";
import { verifyUser } from "../middlewares/isLoggedIn.js";

const router = express.Router();

router.get('/profile/:username', verifyUser, profile);

router.get('/address', verifyUser, address)

router.get('/order',verifyUser , allOrder)

router.get('/order/:id', verifyUser, order)


router.get('/cart', verifyUser, cart)

router.get('/cart/clear', verifyUser, clearCart)

router.put('/order/cancel/:id', verifyUser, cancelorder)
// Post routes
router.post('/checkout', verifyUser, checkout)

router.post('/address/update', verifyUser, updateAdd)

router.post('/profile/update', verifyUser, updateUser)

router.post('/cart/add', verifyUser, addToCart)

router.post('/cart/addQty', verifyUser, addQty)

router.post('/cart/removeQty', verifyUser, removeQty)

router.post('/placeorder', verifyUser, placeOrder)

export default router;