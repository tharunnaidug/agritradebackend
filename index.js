import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv'

const app = express();
dotenv.config();
const port = process.env.PORT||3000;

mongoose.connect(process.env.DBURL)
.then(() => console.log('Connected toDB'))
.catch((err) => console.error('DB connection error:', err));

app.get('/', (req, res) => {
  res.send('Welcome to AgriTarde Backend !!');
})

app.listen(port, () => {
  console.log(`app listening on port ${port}`);
})
