import bcrypt from "bcrypt";
import pool from "../../config/dbconfig.js";
import { errorResponse, successResponse } from "../../utils/req&res.js";
import Jwt from "jsonwebtoken";
import { secret } from "../../config/secret.js";
import QRCode from "qrcode";
import admin from "firebase-admin";
import { checkdevice, generateRandomNumber } from "../../utils/random.js";
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
    const usernameRegex = /^[a-zA-Z0-9_@.]+$/;
    console.log(usernameRegex.test(username));
    //Check Username Length
    if (username.length <= 5)
      errorResponse(
        402,
        {
          data: false,
          msg: "Nama must be at least 5 characters!",
        },
        res
      );
    console.log(username);
    const passwordRegex = /^(?=.*[!@#$%^&*(),.?":{}|<>])(?=.*[a-zA-Z]).{5,13}$/;
    const validatePassword = (password) => {
      return passwordRegex.test(password);
    };
    const bucket = admin.storage().bucket();

    //Check Username
    if (!usernameRegex.test(username))
      errorResponse(401, { data: false, msg: "Invalid UserName" }, res);
    //Check Password
    if (!validatePassword(password)) {
      return errorResponse(401, { data: false, msg: "Invalid Password" }, res);
    }
    const generateQR = async (text) => {
      try {
        const imageData = await QRCode.toFile(
          "file.png",
          `https://pay-sar.vercel.app/user/${text}/ask-question`,
          { errorCorrectionLevel: "H" }
        );
        console.log(imageData);
      } catch (err) {
        console.error(err);
      }
    };
    generateQR(username);
    // Generate Image Number
    let imageNumber = Number(generateRandomNumber());
    //Get device Name
    let device_id = checkdevice(req.headers["user-agent"]);
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);
    // const query =
    //   "INSERT INTO `User` (`username`,`email`,`password`,`device_id`,`image_url`) VALUES (?,?,?,?,?)";
    // const [result] = await pool.execute(query, [
    //   username,
    //   email,
    //   hashedPassword,
    //   device_id,
    //   ImageData[imageNumber],
    // ]);
    const jwtToken = Jwt.sign({ id: 3, email }, secret.JWTTOKEN, {
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
    console.log(user.password, password);
    console.log(bcrypt.compare(password, user.password));
    const checkPassword = await bcrypt.compare(password, user?.password);
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
export const logOut = (req, res) => {
  return errorResponse(200, { data: true, msg: "Log Out Successful" }, res);
};
export const getUser = async (req, res) => {
  try {
    const q = `SELECT id As user_id,username,email,start_date,is_freeze,image_url,description FROM User WHERE id=?`;
    const [result] = await pool.execute(q, [req.user.id]);
    if (result.length === 0) {
      return errorResponse(
        401,
        { data: false, msg: "User Data Not Found" },
        res
      );
    }
    const data = result[0];
    try {
      return successResponse(200, data, res);
    } catch (error) {
      return errorResponse(
        500,
        { data: false, msg: "Internal Server Error" },
        res
      );
    }
  } catch (err) {
    return errorResponse(403, { data: false, msg: err }, res);
  }
};
export const getAllUser = async (req, res) => {
  const q = `SELECT username,image_url FROM User`;
  const [result] = await pool.execute(q);
  if (result?.length === 0) {
    return errorResponse(403, { data: false, msg: "User Data not found" }, res);
  }
  return successResponse(200, result, res);
};
export const getSingleUser = async (req, res) => {
  const userName = req.params.id;
  if (!userName) {
    return errorResponse(402, { data: false, msg: "Username required" });
  }
  try {
    const [userId] = await pool.execute(
      `SELECT id FROM User WHERE username=?`,
      [req.params.id]
    );
    if (userId.length === 0)
      return errorResponse(402, { data: false, msg: "User not found" });

    const q = `SELECT  username,email,image_url,description FROM User WHERE id=?`;
    const [result] = await pool.execute(q, [userId[0].id]);
    if (result.length === 0) {
      return errorResponse(
        401,
        { data: false, msg: "User Data Not Found" },
        res
      );
    }
    const data = result[0];
    return successResponse(200, data, res);
  } catch (err) {
    return errorResponse(403, { data: false, msg: err }, res);
  }
};
export const eidtUser = async (req, res) => {
  const { username, image_url, description } = req.body;
  console.log(username, image_url, description);
  if (!username && !image_url && !description)
    errorResponse(401, { data: false, msg: "All Fields are Required" }, res);
  try {
    let q = `UPDATE User SET username=?,image_url=?,description=? WHERE id=?`;
    const [result] = await pool.execute(q, [
      username,
      image_url,
      description,
      req?.user?.id,
    ]);
    console.log(result);
    if (result.length === 0) {
      return errorResponse(
        500,
        { data: false, msg: "Update User Failed" },
        res
      );
    }
    return successResponse(200, { data: true, msg: "Update Successful" }, res);
  } catch (err) {
    return errorResponse(500, { data: false, msg: err }, res);
  }
};
