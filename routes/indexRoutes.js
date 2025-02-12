import express from 'express'
import { index } from '../controllers/index.controllers.js'
import { verify } from '../middlewares/isLoggedIn.js';


const router = express.Router();

router.get('/', index)

export default router;