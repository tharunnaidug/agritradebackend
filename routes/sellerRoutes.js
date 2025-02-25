import express, { Router } from "express"
import { AllSellerorders, profile, sellerAddProduct, sellerorder, sellerUpdateProduct, sproduct, sproducts, updateSellerorder } from "../controllers/seller.controllers.js";
import { verifySeller } from "../middlewares/isSeller.js";

const router = express.Router();

router.get('/profile/:username', verifySeller, profile);

router.get('/products', verifySeller, sproducts)

router.get('/product/:id', verifySeller, sproduct)

router.get('/orders', verifySeller, AllSellerorders)

router.get('/order/:id', verifySeller, sellerorder)

//post
router.post("/updateorder/:id", verifySeller, updateSellerorder)

router.post("/updateproduct/:id", verifySeller, sellerUpdateProduct)

router.post("/addproduct", verifySeller, sellerAddProduct)

export default router;