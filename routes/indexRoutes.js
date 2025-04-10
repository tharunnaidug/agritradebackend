import express from 'express'
import { allProducts, forgotPassword, getBestSellingProducts, getReviewsByProduct, index, login, logout, product, register, resetPassword, sellerForgotPassword, sellerlogin, sellerregister, sellerResetPassword } from '../controllers/index.controllers.js'
import { genarateOtp } from '../utills/genarateOtp.js';
import { checkEmailExists, checkSellerEmailExists } from '../middlewares/emailCheck.js';


const router = express.Router();

//gets
router.get('/', index)

router.get('/logout', logout)

router.get('/product', allProducts)

router.get('/product/:id', product)

router.get("/review/:productId", getReviewsByProduct);

router.get('/products/bestselling', getBestSellingProducts);

//Posts
router.post('/seller/genarateOtp', checkSellerEmailExists, genarateOtp);

router.post('/user/genarateOtp', checkEmailExists, genarateOtp);

router.post('/register', register)

router.post('/login', login)

router.post('/seller/register', sellerregister)

router.post('/seller/login', sellerlogin)

router.post("/seller/forgotpassword", sellerForgotPassword);

router.post("/forgotpassword", forgotPassword);

router.post("/seller/resetpassword", sellerResetPassword);

router.post("/resetpassword", resetPassword);

export default router;