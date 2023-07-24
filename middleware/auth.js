const { verifyToken } = require("../auth/jwt");
const { error401 } = require("../error/error");
const auth = async (req, res, next) => {
  const token = req.cookies.token;
  try {
    const userId = verifyToken(token).payload;
    req.userId = userId;
    next();
  } catch (err) {
    return error401(res);
  }
};
module.exports = auth;
