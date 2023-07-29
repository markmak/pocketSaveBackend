const User = require("../models/users");
const fs = require("fs").promises;
const { error400 } = require("../error/error");
const changeUserInfo = async (req, res, next) => {
  const { email, name } = req.body;
  try {
    const update = await User.findOneAndUpdate(
      { _id: req.userId },
      { email, name },
      { new: true, runValidators: true }
    );
    if (update) {
      const { name, email } = update;
      res.status(200).json({ name, email });
    } else {
      return error400(res, "Invalid user id");
    }
  } catch (err) {
    next(err);
  }
};
const changePassword = async (req, res, next) => {
  const { oldPassword, password } = req.body;
  const user = await User.findOne({ _id: req.userId });
  if (!user) {
    return error400(res, "Invalid user id");
  }
  const comparePassword = await user.comparePassword(oldPassword);
  if (!comparePassword) {
    return error400(res, "Incorrect Password");
  }
  if (password.length < 8) {
    return error400(res, "Password must be at least 8 characters long.");
  }
  if (password.length > 29) {
    return error400(res, "Password must be less than 30 characters");
  }
  try {
    const update = await User.findOneAndUpdate(
      { _id: req.userId },
      { password },
      { new: true }
    );
    if (update) {
      res.status(200).json({ msg: "Password Resetted" });
    } else {
      return error400(res, "Invalid user id");
    }
  } catch (err) {
    next(err);
  }
};
const changeIcon = async (req, res, next) => {
  try {
    const update = await User.findOneAndUpdate(
      { _id: req.userId },
      { img: `${req.file.filename}` },
      { new: true }
    );
    if (update) {
      res.status(200).json({ img: update.img });
    } else {
      return error400(res, "Invalid user id");
    }
  } catch (err) {
    next(err);
  }
};
const removeIcon = async (req, res, next) => {
  try {
    const update = await User.findOneAndUpdate(
      { _id: req.userId },
      { img: "" }
    );
    if (update) {
      const folder = __dirname.split("\\");
      folder.pop();
      await fs.unlink(`${folder.join("/")}/public/${update.img}`);
      res.status(200).json({ msg: "icon removed." });
    } else {
      return error400(res, "Invalid user id");
    }
  } catch (err) {
    next(err);
  }
};

module.exports = { changeUserInfo, changePassword, changeIcon, removeIcon };
