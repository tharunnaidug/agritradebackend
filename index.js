import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv'
import cors from 'cors';
import cookieParser from "cookie-parser"
import { createServer } from 'http';
import { Server } from 'socket.io';
import indexRoutes from './routes/indexRoutes.js';
import userRoutes from './routes/userRoutes.js';
import auctionRoutes from './routes/auctionRoutes.js';
import sellerRoutes from './routes/sellerRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

const app = express();
dotenv.config();
const port = process.env.PORT || 3000;
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true
  }
});
const auctionRooms = new Map();

mongoose.connect(process.env.DBURL)
  .then(() => console.log('Connected to DB'))
  .catch((err) => console.error('DB connection error:', err));


app.use(express.urlencoded({ extended: 'false' }))
app.use(cors({
  "origin": "http://localhost:5173",
  credentials: true
}))
app.use(cookieParser())
app.set('view engine', 'html');
app.use(express.json());
app.set("io", io);


app.use('/', indexRoutes)
app.use('/user', userRoutes)
app.use('/admin', adminRoutes)
app.use('/seller', sellerRoutes)
app.use('/auction', auctionRoutes)


//websockets
// io.on("connection", (socket) => {
//   console.log("New client connected:", socket.id);

//   socket.on("joinAuction", (auctionId) => {
//     socket.join(auctionId);
//     console.log(`User joined auction room: ${auctionId}`);
    
//     if (!auctionRooms.has(auctionId)) {
//       auctionRooms.set(auctionId, new Set());
//     }
//     auctionRooms.get(auctionId).add(socket.id);
//   });

//   socket.on("disconnect", () => {
//     console.log("Client disconnected:", socket.id);
//     auctionRooms.forEach((users, auctionId) => {
//       users.delete(socket.id);
//       if (users.size === 0) {
//         auctionRooms.delete(auctionId);
//       }
//     });
//   });
// });





server.listen(port, () => {
  console.log(`app listening on port ${port}`);
})
