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
  const page = parseInt(req.query.page) || 1; // Default page to 1
  const perPage = 10; // Default items per page to 10
  const offset = (page - 1) * perPage;

  let q = `SELECT id AS paysar_id,title,content,sent_date FROM PAYSAR WHERE user_id=?`;
  // let q = `SELECT id AS paysar_id, title, content, sent_date FROM PAYSAR WHERE user_id=? LIMIT ? OFFSET ?`;

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

// export const getPaysar = async (req, res) => {
//   const page = parseInt(req.query.page) || 1; // Default page to 1
//   const perPage = 10; // Default items per page to 10
//   const user_id = req?.user?.id;

//   // Calculate offset based on the page and perPage values
//   const offset = (page - 1) * perPage;

//   let q = `SELECT id AS paysar_id, title, content, sent_date FROM PAYSAR WHERE user_id=? LIMIT ? OFFSET ?`;

//   try {
//     const [result] = await pool.execute(q, [user_id, perPage, offset]);

//     if (result.length === 0) {
//       return errorResponse(402, { data: false, msg: "No Paysar found" }, res);
//     }

//     return successResponse(200, result, res);
//   } catch (e) {
//     return errorResponse(500, { data: false, msg: e.message }, res);
//   }
// };

export const getUserPaysar = async (req, res) => {
  let q = `SELECT id AS paysar_id,title,content,sent_date FROM PAYSAR WHERE sender_id=? `;
  const user_id = req.user.id;
  console.log(user_id);
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
