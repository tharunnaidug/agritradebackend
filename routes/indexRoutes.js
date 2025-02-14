import express from 'express'
import { index, login, logout, register } from '../controllers/index.controllers.js'
import { verify } from '../middlewares/isLoggedIn.js';
import { genarateOtp } from '../utills/genarateOtp.js';


const router = express.Router();

router.get('/', index)

router.post('/genarateOtp',genarateOtp);

router.post('/register', register)

router.post('/login', login)

router.get('/logout', logout)

export default router;