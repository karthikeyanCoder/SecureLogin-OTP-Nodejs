import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
  const MONGO_URL = process.env.MONGO_URL;
  try {
    await mongoose.connect(MONGO_URL);
    console.log("MongoDB Connected Successfully");
  } catch (error) {
    console.log("MongoDB Connection Error", error);
    process.exit(1);
  }
};

export default connectDB;
