import express from "express";
import cors from "cors";
import helmet from "helmet";

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

const PORT = process.env.PORT || 8800;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
