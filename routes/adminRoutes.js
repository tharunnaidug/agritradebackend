import express, { Router } from "express"
import { allAuction, allOrders, allProducts, allSellers, allUsers, newAuction, updateAuction, updateOrder, updateProduct, updateSeller, updateUser } from "../controllers/admin.controllers.js";

const router=express.Router();

router.get('/users',allUsers)

router.get('/orders',allOrders)

router.get('/auctions',allAuction)

router.get('/products',allProducts)

router.get('/sellers',allSellers)

router.get('/newauctions',newAuction)//For Getting Auctions For reviewing and approving

//post Routes
router.post('/updateAuction/:id',updateAuction)

router.post('/updateProduct/:id',updateProduct)

router.post('/updateUser/:id',updateUser)

router.post('/updateSeller/:id',updateSeller)

router.post('/updateOrder/:id',updateOrder)

export default router;