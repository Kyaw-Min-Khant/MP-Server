import pool from "../../config/dbconfig.js";
import { errorResponse, successResponse } from "../../utils/req&res.js";
import { UAParser } from "ua-parser-js";

export const createBlog = async (req, res) => {
  const { title, content, user_id } = req.body;
  try {
    {
      if (!title || !content || !user_id) {
        return errorResponse(
          400,
          {
            data: "false",
            msg: "All Fields are required",
          },
          res
        );
      }
      const parser = new UAParser(req.headers["user-agent"]);
      let device_name;
      const checkdevice = parser.getDevice();
      if (checkdevice?.vendor !== undefined) {
        device_name = String(checkdevice?.vendor + checkdevice.model);
      } else if (parser.getOS().name !== undefined) {
        device_name = String(parser.getOS().name);
      } else {
        device_name = req.headers["user-agent"];
      }
      let q =
        "INSERT INTO `PAYSAR` (`user_id`,`title`,`content`,`device_name`) VALUES (?,?,?,?)";
      const [result] = await pool.execute(q, [
        user_id,
        title,
        content,
        device_name,
      ]);
      if (result.length === 0) {
        return errorResponse(403, { data: false, msg: "Paysar not sent" });
      }
      return successResponse(
        200,
        {
          data: true,
          msg: "Paysar sent successfully",
        },
        res
      );
    }
  } catch (e) {
    return errorResponse(403, { data: false, msg: "Paysar not sent" });
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
