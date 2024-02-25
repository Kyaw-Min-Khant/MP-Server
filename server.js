import express from "express";
import { config } from "dotenv";
import morgan from "morgan";
import cors from "cors";
import helmet from "helmet";
import pool from "./src/config/dbconfig.js";
import authRouter from "./src/Routes/Client/authRoute.js";
import payserRouter from "./src/Routes/Client/blogRoute.js";
import userRouter from "./src/Routes/Client/userRoute.js";
import imageRouter from "./src/Routes/Client/imageRoute.js";
import feedbackRouter from "./src/Routes/Client/feedbackRoute.js";
import corsOptions from "./src/config/cors.js";

config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(morgan("dev"));
app.use(cors());
app.use(
  express.urlencoded({ limit: "60mb", extended: true, parameterLimit: 1000000 })
);
pool.getConnection((err, connection) => {
  if (err) {
    console.error("Error connecting to MySQL:", err);
    return;
  }
  console.log("Connection is good");
  connection.release();
});
app.use("/v1/api/auth", authRouter);
app.use("/v1/api/paysar", payserRouter);
app.use("/v1/api", userRouter);
app.use("/v1/api/images", imageRouter);
app.use("/v1/api/feedback", feedbackRouter);

app.get("/", async (req, res) => {
  return res.send("Welcome");
});

app.listen(process.env.PORT, () =>
  console.log(`Server is Listen on ${process.env.PORT}`)
);
