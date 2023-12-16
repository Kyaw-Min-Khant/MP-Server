import mysql from "mysql2/promise.js";
import { secret } from "./secret.js";
const pool = mysql.createPool({
  host: secret.DB_HOST,
  user: secret.DB_USER,
  port: 12936,
  password: secret.DB_PASSWORD,
  database: secret.DB_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  connectTimeout: 60000,
  namedPlaceholders: true,
});
export default pool;
