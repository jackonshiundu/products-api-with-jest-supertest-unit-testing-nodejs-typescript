import mongoose from "mongoose";

//creatign an Async function to connect to be database this fu
export default async function connectDB() {
  try {
    //Checking if the connection string exixts first before  Connecting , an error is thrown idf there is no connection String.
    if (!process.env.MONGODB_URL) {
      throw new Error("MONGODB_URL enviroment variable is not available");
      // Attempt to connect to MongoDB if the URL is available
      await mongoose.connect(process.env.MONGODB_URL);
      console.log("MongoDB connected successfully!");
    }
  } catch (error) {
    //if there is an error log the error and return it.
    console.error("MONGODB CONN ERR:", error);
    throw error;
  }
}
