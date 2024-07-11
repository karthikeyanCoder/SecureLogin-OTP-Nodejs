import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import connectDB from "./src/DB/db.js";
import authRoutes from "./src/Routes/authRoutes.js";
import { verifyToken } from "./src/Middleware/authMiddleware.js";
dotenv.config();
const PORT = process.env.PORT || 8080;

const app = express();
app.use(bodyParser.json());
app.use(verifyToken);
app.use("/", authRoutes);

app.listen(PORT, async() => {
    await connectDB();
    console.log(`Server running on port ${PORT}`);
});
