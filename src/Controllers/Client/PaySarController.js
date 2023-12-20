import pool from "../../config/dbconfig.js";
import { errorResponse, successResponse } from "../../utils/req&res.js";
import { checkdevice } from "../../utils/random.js";
export const createBlog = async (req, res) => {
  const { title, content, username, sender_id } = req.body;

  try {
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
    if (userId.length === 0) {
      return errorResponse(402, { data: false, msg: "User not found" }, res);
    }
    let device_name = checkdevice([req.headers["user-agent"]]);

    let q;
    if (sender_id === "undefined") {
      q =
        "INSERT INTO `PAYSAR` (`user_id`,`title`,`content`,`device_name`) VALUES (?,?,?,?)";
    } else {
      q =
        "INSERT INTO `PAYSAR` (`user_id`,`title`,`content`,`device_name`,`sender_id`) VALUES (?,?,?,?,?)";
    }
    const [result] = await pool.execute(q, [
      userId[0].id,
      title,
      content,
      device_name,
      sender_id !== undefined && sender_id,
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
    console.log(e);
    return errorResponse(403, { data: false, msg: "Paysar not sent" }, res);
  }
};

export const getPaysar = async (req, res) => {
  const limit = parseInt(req.query.limit) || 7; // Default page to 1
  const perPage = parseInt(req.query.page) || 1; // Default items per page to 10

  const offset = Number((perPage - 1) * limit);
  const user_id = req?.user?.id;

  let q = `SELECT id AS paysar_id, title, content, sent_date, replay
          FROM PAYSAR
          WHERE user_id=${user_id}
          ORDER BY sent_date DESC
          LIMIT ${limit} OFFSET ${offset}`;

  try {
    const [result] = await pool.execute(q);
    if (result.length === 0) {
      return errorResponse(402, { data: false, msg: "No Paysar found" }, res);
    }
    const countQuery = "SELECT COUNT(*) as Count FROM PAYSAR WHERE user_id=?";
    const [countResult] = await pool.execute(countQuery, [user_id]);
    const totalPage = Math.ceil(+countResult[0]?.Count / limit);
    return successResponse(
      200,
      { result, page: +perPage, limit: +limit, totalPage },
      res
    );
  } catch (e) {
    return errorResponse(500, { data: false, msg: e.message }, res);
  }
};

export const getUserPaysar = async (req, res) => {
  const limit = parseInt(req.query.limit) || 7;
  const perPage = parseInt(req.query.page) || 1;
  const offset = Number((perPage - 1) * limit);
  let q = `SELECT id AS paysar_id,title,content,sent_date,replay FROM PAYSAR WHERE sender_id=?  ORDER BY sent_date DESC
          LIMIT ${limit} OFFSET ${offset}`;
  const user_id = req.user.id;
  try {
    const [result] = await pool.execute(q, [user_id]);
    if (result.length === 0) {
      return errorResponse(402, { data: false, msg: "No Paysar found" }, res);
    }
    const countQuery = "SELECT COUNT(*) as Count FROM PAYSAR WHERE sender_id=?";
    const [countResult] = await pool.execute(countQuery, [user_id]);
    const totalPage = Math.ceil(+countResult[0]?.Count / limit);

    return successResponse(
      200,
      { result, page: +perPage, limit: +limit, totalPage },
      res
    );
  } catch (e) {
    return errorResponse(500, { data: false, msg: e }, res);
  }
};

export const paysarreplay = async (req, res) => {
  const replay = req.body.replay;
  const paysarId = req.body.paysarId;
  if (!replay) {
    return errorResponse(
      402,
      { data: false, msg: "Need to replay message" },
      res
    );
  }
  try {
    const [paysar] = await pool.execute(
      `SELECT user_id FROM PAYSAR WHERE id=? `,
      [paysarId]
    );
    if (paysar.length === 0) {
      return errorResponse(400, { data: false, msg: "Paysar not found" }, res);
    }
    if (paysar[0].user_id !== req.user.id) {
      return errorResponse(
        402,
        {
          data: false,
          msg: "User have no permission to replay",
        },
        res
      );
    }
    let q = `UPDATE PAYSAR SET replay=? WHERE id=?`;
    const [result] = await pool.execute(q, [replay, paysarId]);
    if (result.length === 0) {
      return errorResponse(404, { data: false, msg: "Reply Failed" }, res);
    }
    return successResponse(200, { data: true, msg: "Replay Successful" }, res);
  } catch (e) {
    console.log(e);
    return errorResponse(500, { data: false, msg: "Server Error" }, res);
  }
};
