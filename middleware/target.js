const Target = require("../models/targets");
const { error400 } = require("../error/error");
const findTarget = async (req, res, next) => {
  const { id } = req.params;
  try {
    const target = await Target.findOne({
      createdBy: req.userId,
      _id: id,
    });
    if (!target) {
      return error400(res, "Invalid target id");
    }
    req.target = target;
    next();
  } catch (err) {
    next(err);
  }
};
const checkCurrentTarget = async (req, res, next) => {
  try {
    const currentTarget = await Target.findOne({
      createdBy: req.userId,
      status: "on going",
    });
    if (currentTarget && req.body.status !== "") {
      return error400(
        res,
        "You can only set and work towards one target at a time."
      );
    }
  } catch (err) {
    next(err);
  }
  next();
};

module.exports = { findTarget, checkCurrentTarget };
