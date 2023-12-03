import bcrypt from "bcrypt";
import pool from "../../config/dbconfig.js";
import { errorResponse } from "../../utils/req&res.js";

export const register = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    if (!name) {
      return errorResponse(
        400,
        { data: false, message: "Name is Require!" },
        res
      );
    }
    if (!email) {
      return errorResponse(
        400,
        { data: false, message: "Email is required!" },
        res
      );
    }
    if (!password) {
      return errorResponse(
        400,
        { data: false, message: "Password is required!" },
        res
      );
    }
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    const query =
      "INSERT INTO `User` (`name`,`email`,`password`) VALUES (?,?,?)";
    const result = await pool.execute(query, [name, email, hashedPassword]);
    return res.status(200).json("Register SuccessFul");
  } catch (err) {
    return res.status(500).json(err);
  }
};
