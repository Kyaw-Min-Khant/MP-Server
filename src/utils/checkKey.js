import { secret } from "../config/secret.js";
import CryptoJS from "crypto-js";

export const checkHashcode = (userId) => {
  return Number(
    CryptoJS.AES.decrypt(userId, secret.JWTTOKEN).toString(CryptoJS.enc.Utf8)
  );
};
