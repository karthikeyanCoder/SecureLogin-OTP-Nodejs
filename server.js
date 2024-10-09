import express from "express";
import dotenv from "dotenv";
import connectDB from "./src/DB/db.js";
import authRoutes from "./src/Routes/authRoutes.js";
import { verifyToken } from "./src/Middleware/authMiddleware.js";
import cors from "cors";
import adminRouter from "./src/Routes/adminRoutes.js";
import startMappingRouters from "./src/Routes/startMappingRoutes.js";
import startMapping from "./src/Routes/startMapping.js";
import autoMatic from "./src/Routes/autoMatic.js";
import version from "./src/Routes/versionRoutes.js";
import bookSession from "./src/Routes/BookApoinmentRoutes.js"
dotenv.config();
const PORT = process.env.PORT || 8080;

const app = express();
app.use(cors());
app.use(express.json());
app.use(verifyToken);
app.use("/", authRoutes);
app.use("/", adminRouter);
app.use("/", startMappingRouters);
app.use("/", startMapping);
app.use("/", autoMatic);
app.use("/", version);
app.use("/",bookSession)
app.listen(PORT, async () => {
  await connectDB();
  console.log(`Server running on http://localhost:${PORT}`);
});
