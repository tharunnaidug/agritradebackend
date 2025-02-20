import express, { Router } from "express"
import { verify } from "jsonwebtoken";
import { profile } from "../controllers/user.controllers";

const router=express.Router();

router.get('/profile/:username',verify,profile);

export default router;