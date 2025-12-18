import express from "express";
import morgan from "morgan";
import dotenv from "dotenv"
import cors from "cors";
import authRoutes from "./routes/authRoutes.js"
import connectDB from "./model/model.js";

dotenv.config();
const app = express();
app.use(express.json());

app.use(morgan('dev'))
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));



connectDB();

import eventRoutes from "./routes/eventRoutes.js";

app.use('/v1/auth', authRoutes);
app.use('/v1/event', eventRoutes);

app.get('/', (req, res) => {

})



const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`App is listening on port ${PORT}`);

})
