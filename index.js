import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv'
import cors from 'cors';
import cookieParser from "cookie-parser"
import { createServer } from 'http';
import { initializeWebSocket } from "./utills/webSockets.js";
import { startAuctions, notifyInterestedUsers } from "./utills/cronJobs.js";
import indexRoutes from './routes/indexRoutes.js';
import userRoutes from './routes/userRoutes.js';
import auctionRoutes from './routes/auctionRoutes.js';
import sellerRoutes from './routes/sellerRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

const app = express();
dotenv.config();
const port = process.env.PORT || 3000;


mongoose.connect(process.env.DBURL)
  .then(() => console.log('Connected to DB'))
  .catch((err) => console.error('DB connection error:', err));


app.use(express.urlencoded({ extended: 'false' }))
app.use(cors({
  "origin": "*",
  credentials: true
}))
app.use(cookieParser())
app.set('view engine', 'html');
app.use(express.json());

const server = createServer(app);
const io = initializeWebSocket(server);
app.set("io", io);


app.use('/', indexRoutes)
app.use('/user', userRoutes)
app.use('/admin', adminRoutes)
app.use('/seller', sellerRoutes)
app.use('/auction', auctionRoutes)

startAuctions()
notifyInterestedUsers()



server.listen(port, () => {
  console.log(`app listening on port ${port}`);
})
