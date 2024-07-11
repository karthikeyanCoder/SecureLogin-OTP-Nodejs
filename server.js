import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import connectDB from './src/DB/db.js';
import authRoutes from "./src/Routes/authRoutes.js";
import { verifyToken } from './src/Middleware/authMiddleware.js';
dotenv.config();
connectDB();

const app = express();
app.use(bodyParser.json());
 app.use(verifyToken)
app.use('/', authRoutes);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
