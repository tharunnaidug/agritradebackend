import express from 'express'
import { allProducts, index, login, logout, product, register } from '../controllers/index.controllers.js'
import { genarateOtp } from '../utills/genarateOtp.js';


const router = express.Router();

router.get('/', index)

router.post('/genarateOtp',genarateOtp);

router.post('/register', register)

router.post('/login', login)

router.get('/logout', logout)

router.get('/product', allProducts)

router.get('/product/:id', product)

export default router;