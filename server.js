import express from "express";
import { config } from "dotenv";
import morgan from "morgan";
import cors from "cors";
import helmet from "helmet";
import pool from "./src/config/dbconfig.js";
import authRouter from "./src/Routes/Client/authRoute.js";
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
app.use("/v1/api/users", authRouter);

app.get("/", async (req, res) => {
  return res.send("Welcome");
});

app.listen(process.env.PORT, () =>
  console.log(`Server is Listen on ${process.env.PORT}`)
);
