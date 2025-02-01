import mongoose from "mongoose";

export default async function connectDB() {
  try {
    if (!process.env.MONGODB_URL) {
      throw new Error("MONGODB_URL enviroment variable is not available");

      await mongoose.connect(process.env.MONGODB_URL);
      console.log("MongoDB connected successfully!");
    }
  } catch (error) {
    console.error("MONGODB CONN ERR:", error);
    throw error;
  }
}
