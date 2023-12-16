import Jwt from "jsonwebtoken";
import { secret } from "../config/secret.js";
import { errorResponse } from "../utils/req&res.js";
export const verifyToken = async (req, res, next) => {
  try {
    const userToken =
      req?.headers["authorization"] &&
      req?.headers["authorization"]?.split(" ")[1];
    if (!userToken) {
      return errorResponse(403, { data: false, msg: "No Token Provided" });
    } else {
      Jwt.verify(userToken, secret.JWTTOKEN, (err, data) => {
        if (err) {
          return errorResponse(403, { data: false, msg: "Invalid Token" }, res);
        }
        req.user = data;
        return next();
      });
    }
  } catch (err) {
    return errorResponse(500, { data: false, msg: "No Token Provided" }, res);
  }
};
