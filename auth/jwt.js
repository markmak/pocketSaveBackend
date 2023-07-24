const jwt = require("jsonwebtoken");

const createToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
};

const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

const attachCookie = (res, userId) => {
  const token = createToken({ payload: userId });
  const oneDay = 1000 * 60 * 60 * 24;
  res.cookie("token", token, {
    httpOnly: true,
    expires: new Date(Date.now() + oneDay),
  });
};

const logoutCookie = (res) => {
  res.clearCookie("token");
};

module.exports = { createToken, verifyToken, attachCookie, logoutCookie };
