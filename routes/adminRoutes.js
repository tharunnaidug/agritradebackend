import express, { Router } from "express"
import { allAuction, allOrders, allProducts, allSellers, allUsers, updateAuction, updateOrder, updateProduct, updateSeller, updateUser } from "../controllers/admin.controllers.js";

const router=express.Router();

router.get('/users',allUsers)

router.get('/orders',allOrders)

router.get('/auctions',allAuction)

router.get('/products',allProducts)

router.get('/sellers',allSellers)

//post Routes
router.post('/updateAuction',updateAuction)

router.post('/updateProduct',updateProduct)

router.post('/updateUser',updateUser)

router.post('/updateSeller',updateSeller)

router.post('/updateOrder',updateOrder)

export default router;