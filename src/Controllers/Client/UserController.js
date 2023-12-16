import bcrypt from "bcrypt";
import pool from "../../config/dbconfig.js";
import { errorResponse, successResponse } from "../../utils/req&res.js";
import { UAParser } from "ua-parser-js";
import Jwt from "jsonwebtoken";
import { secret } from "../../config/secret.js";
export const register = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    if (!username || !email || !password) {
      return errorResponse(
        401,
        { data: false, msg: "All Fields Required" },
        res
      );
    }
    const parser = new UAParser(req.headers["user-agent"]);
    let device_id;
    const checkdevice = parser.getDevice();
    if (checkdevice?.vendor !== undefined) {
      device_id = String(checkdevice?.vendor + checkdevice.model);
    } else if (parser.getOS().name !== undefined) {
      device_id = String(parser.getOS().name);
    } else {
      device_id = req.headers["user-agent"];
    }
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    const query =
      "INSERT INTO `User` (`username`,`email`,`password`,`device_id`) VALUES (?,?,?,?)";
    const [result] = await pool.execute(query, [
      username,
      email,
      hashedPassword,
      device_id,
    ]);
    const jwtToken = Jwt.sign({ id: result.insertId, email }, secret.JWTTOKEN, {
      expiresIn: "30d",
    });
    return successResponse(200, { data: true, token: jwtToken }, res);
  } catch (err) {
    console.log(err);
    return errorResponse(402, { data: false, msg: err }, res);
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email && !password) {
    errorResponse(400, { data: false, msg: "All Fields Are required" }, res);
  }
  try {
    let q = "SELECT * FROM User WHERE email=?";
    const [result] = await pool.execute(q, [email]);
    if (result.length === 0) {
      return errorResponse(401, { data: false, msg: "User not Found" }, res);
    }
    const user = result[0];
    if (user.is_Freeze === 0) {
      return res.status(403).json({ message: "Your Account is Locked!" });
    }
    const checkPassword = bcrypt.compare(password, user?.password);
    if (!checkPassword) {
      return res.status(401).json({ message: "Password is Invalid" });
    }
    const token = Jwt.sign({ id: user.id, email }, secret.JWTTOKEN, {
      expiresIn: "30d",
    });
    return successResponse(200, { data: true, token }, res);
  } catch (e) {
    errorResponse(500, { data: false, msg: e }, res);
  }
};
