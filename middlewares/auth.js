const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
const { UNAUTHORIZED_ERROR_CODE } = require("../utils/errors");

module.exports = (req, res, next) => {
  const { authorization } = req.headers; // When a user sends a request, it usually contains a header like this: Authorization: Bearer jwt_string
  if (!authorization || !authorization.startsWith("Bearer ")) { // if authorization is undefined
    return res
      .status(UNAUTHORIZED_ERROR_CODE)
      .send({ message: "Authorization required!" });
  }
  const token = authorization.replace("Bearer ", ""); // remove "Bearer " part. Now token contains only the real JWT string.
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    console.error(err);
    return res
      .status(UNAUTHORIZED_ERROR_CODE)
      .send({ message: "Authorization required!" });
  }

  req.user = payload; // If there are no issues with the token, the middleware should add the token payload to the user object and call next():

  return next();
};
