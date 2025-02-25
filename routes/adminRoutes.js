import express, { Router } from "express"
import { allAuction, allOrders, allProducts, allUsers, users } from "../controllers/admin.controllers.js";

const router=express.Router();

router.get('/users',allUsers);

router.get('/orders',allOrders);

router.get("/auctions",allAuction)

router.get("/products",allProducts)

export default router;