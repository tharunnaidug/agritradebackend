import express from 'express'
import { index } from '../controllers/index.controllers.js'
import { verify } from '../middlewares/isLoggedIn.js';
import { get } from 'mongoose';
import { genarateOtp } from '../utills/genarateOtp.js';


const router = express.Router();

router.get('/', index)

router.post('/genarateOtp',genarateOtp);

export default router;