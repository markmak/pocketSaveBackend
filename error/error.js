const { logoutCookie } = require("../auth/jwt");
const error400 = (res, errMsg) => {
  return res.status(400).json({ errMsg });
};
const error401 = (res) => {
  logoutCookie(res);
  return res.status(401).json({ errMsg: "Invalid Credentials" });
};
const errorHandleFunction = (err, req, res, next) => {
  if (err.name === "ValidationError") {
    const errorList = Object.keys(err.errors);
    return res.status(400).json({ errMsg: err.errors[errorList[0]].message });
  } else if (err.code === 11000) {
    return res.status(400).json({ errMsg: "Email is already registered." });
  } else {
    console.log(err);
    return res
      .status(500)
      .json({ errMsg: "Internal server error, please try again later." });
  }
};
module.exports = { error400, error401, errorHandleFunction };
