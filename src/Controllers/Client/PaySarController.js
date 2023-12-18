import pool from "../../config/dbconfig.js";
import { errorResponse, successResponse } from "../../utils/req&res.js";
import CryptoJS from "crypto-js";
import { secret } from "../../config/secret.js";
import { checkdevice } from "../../utils/random.js";

export const createBlog = async (req, res) => {
  const { title, content, username } = req.body;
  try {
    console.log(username);
    if (!title || !content || !username) {
      return errorResponse(
        400,
        {
          data: "false",
          msg: "All Fields are required",
        },
        res
      );
    }
    const [userId] = await pool.execute(
      `SELECT id FROM User WHERE username=?`,
      [username]
    );
    console.log(userId);
    if (userId.length === 0)
      errorResponse(402, { data: false, msg: "User not found" }, res);
    let device_name = checkdevice([req.headers["user-agent"]]);
    let q =
      "INSERT INTO `PAYSAR` (`user_id`,`title`,`content`,`device_name`) VALUES (?,?,?,?)";
    const [result] = await pool.execute(q, [
      userId[0].id,
      title,
      content,
      device_name,
    ]);
    if (result.length === 0) {
      return errorResponse(403, { data: false, msg: "Paysar not sent" }, res);
    }
    return successResponse(
      200,
      {
        data: true,
        msg: "Paysar sent successfully",
      },
      res
    );
  } catch (e) {
    return errorResponse(403, { data: false, msg: "Paysar not sent" }, res);
  }
};

export const getPaysar = async (req, res) => {
  let q = `SELECT id AS paysar_id,title,content,sent_date FROM PAYSAR WHERE user_id=?`;
  const user_id = req?.user?.id;
  try {
    const [result] = await pool.execute(q, [user_id]);
    if (result.length === 0) {
      return errorResponse(402, { data: false, msg: "No Paysar found" }, res);
    }
    return successResponse(200, result, res);
  } catch (e) {
    return errorResponse(500, { data: false, msg: e }, res);
  }
};
