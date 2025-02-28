import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import routes from "./routes/index";
import mongoose from "mongoose";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: [""], //This is where you enter the urls that are allowed to access your routes separate them with a comma.
    credentials: true, //alllows cookies to be sent with requests.
  })
);

app.use(express.json());
app.use(helmet());

app.get("/", async (req: express.Request, res: express.Response) => {
  try {
    res.send("Hello world");
  } catch (error) {
    console.log(error);
  }
});
app.use("/api/v1/", routes());

const PORT = 8009;
// Check if it's not a test environment before starting the server
if (!process.env.TEST_ENV) {
  app.listen(9002, () => {
    console.log(`Backend server is running at port 9000`);
  });
} else {
  if (!process.env.MONGODB_URL) {
    throw new Error("MONGODB_URL environment variable is not defined");
  }

  mongoose
    .connect(process.env.MONGODB_URL)
    .then(() => {
      console.log("MongoDB connected to the backend successfully");
    })
    .catch((err) => console.log(err));
}
//routes

//using the connect db to connect to the data bse and only after a successful connection is when our app will start LIstening. We are using then and catch because the unction returns a promise.

export default app;
