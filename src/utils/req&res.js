export const errorResponse = (statusCode, msg, res) => {
  res.status(statusCode || 400).json(msg ? msg : "Something went wrong");
};
export const successResponse = (statusCode, msg, res) => {
  res.status(statusCode || 200).json(msg ? msg : "OK");
};
