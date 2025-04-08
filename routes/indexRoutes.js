import express from 'express'
import { allProducts, forgotPassword, index, login, logout, product, register, resetPassword, sellerForgotPassword, sellerlogin, sellerregister, sellerResetPassword } from '../controllers/index.controllers.js'
import { genarateOtp } from '../utills/genarateOtp.js';
import { checkEmailExists, checkSellerEmailExists } from '../middlewares/emailCheck.js';


const router = express.Router();

router.get('/', index)

router.post('/seller/genarateOtp', checkSellerEmailExists, genarateOtp);

router.post('/user/genarateOtp', checkEmailExists, genarateOtp);

router.post('/register', register)

router.post('/login', login)

router.post('/seller/register', sellerregister)

router.post('/seller/login', sellerlogin)

router.get('/logout', logout)

router.get('/product', allProducts)

router.get('/product/:id', product)

router.post("/seller/forgotpassword", sellerForgotPassword);

router.post("/forgotpassword", forgotPassword);

router.post("/seller/resetpassword", sellerResetPassword);

router.post("/resetpassword", resetPassword);

export default router;