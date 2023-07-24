const User = require("../models/users");
const { attachCookie, logoutCookie } = require("../auth/jwt");
const { error400, error401 } = require("../error/error");

const register = async (req, res, next) => {
  const { name, email, password } = req.body;
  try {
    const createUser = await User.create({ name, email, password });
    const user = {
      name: createUser.name,
      email: createUser.email,
      img: createUser.img,
    };
    attachCookie(res, createUser._id);
    return res.status(201).json(user);
  } catch (err) {
    next(err);
  }
};
const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return error400(res, "Plase input email and password");
  }
  const user = await User.findOne({ email });
  if (!user) {
    return error401(res);
  }
  const comparePassword = await user.comparePassword(password);
  if (!comparePassword) {
    return error401(res);
  }
  attachCookie(res, user._id);
  res.status(200).json({ name: user.name, email: user.email, img: user.img });
};
const logout = async (req, res) => {
  logoutCookie(res);
  res.status(200).json({ msg: "User logged out" });
};
const getUser = async (req, res) => {
  try {
    const { name, email, img } = await User.findById(req.userId);
    res.status(200).json({ name, email, img });
  } catch (err) {
    return error401(res);
  }
};

module.exports = { register, login, logout, getUser };
