import dotenv from "dotenv";
dotenv.config();
export const secret = {
  PORT: process.env.Port,
  DB_HOST: process.env.Host,
  DB_USER: process.env.User,
  DB_PASSWORD: process.env.Password,
  DB_DATABASE: process.env.Database,
};
