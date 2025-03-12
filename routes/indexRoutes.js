import express from 'express'
import { allProducts, index, login, logout, product, register, sellerlogin, sellerregister } from '../controllers/index.controllers.js'
import { genarateOtp } from '../utills/genarateOtp.js';
import { checkEmailExists, checkSellerEmailExists } from '../middlewares/emailCheck.js';


const router = express.Router();

router.get('/', index)

router.post('/seller/genarateOtp',checkSellerEmailExists,genarateOtp);

router.post('/user/genarateOtp',checkEmailExists,genarateOtp);

router.post('/register', register)

router.post('/login', login)

router.post('/seller/register', sellerregister)

router.post('/seller/login', sellerlogin)

router.get('/logout', logout)

router.get('/product', allProducts)

router.get('/product/:id', product)

export default router;