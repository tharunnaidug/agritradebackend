import express, { Router } from "express"
import { allOrders, allUsers, users } from "../controllers/admin.controllers";

const router=express.Router();

router.get('/users',allUsers);

router.arguments('/orders',allOrders);

export default router;