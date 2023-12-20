import pool from "../../config/dbconfig.js";
import { errorResponse, successResponse } from "../../utils/req&res.js";

export const createFeedback = async (req, res) => {
  const { category, content } = req.body;
  const user_id = req.user.id;
  if (!category || !content) {
    return errorResponse(
      400,
      { data: false, msg: "All Fields are required" },
      res
    );
  }
  try {
    let q =
      "INSERT INTO FeedBack (`user_id`,`category`,`content`) VALUES (?,?,?)";
    const [result] = await pool.execute(q, [user_id, category, content]);
    if (result.length === 0) {
      return errorResponse(402, { data: false, msg: "Feedback not sent" }, res);
    }
    return successResponse(
      200,
      {
        data: true,
        msg: "Feedback sent successfully",
      },
      res
    );
  } catch (err) {
    console.log(err);
    return errorResponse(401, { data: false, msg: "Feedback not sent" }, res);
  }
};
