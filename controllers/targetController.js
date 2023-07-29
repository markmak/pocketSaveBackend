const Target = require("../models/targets");
const { updateOption } = require("../lookup");
const fs = require("fs").promises;
const { error400 } = require("../error/error");
const { checkDate } = require("../lookup");
const addTarget = async (req, res, next) => {
  const { name, amount, targetSavingPeriod, comment } = JSON.parse(
    req.body.json
  );
  const newTarget = {
    name,
    status: "on going",
    amount,
    targetSavingPeriod,
    comment,
    createdAt: Date.now(),
    createdBy: req.userId,
  };
  if (req.file) {
    newTarget.img = `${req.file.filename}`;
  }
  try {
    const addedTarget = await Target.create(newTarget);
    return res.status(201).json(addedTarget);
  } catch (err) {
    next(err);
  }
};
const getTargets = async (req, res, next) => {
  try {
    const targets = await Target.find({
      createdBy: req.userId,
      status: { $ne: "on going" },
    })
      .sort({ createdAt: -1 })
      .select("_id img name status amount createdAt");
    return res.status(200).json(targets);
  } catch (err) {
    next(err);
  }
};
const getCurrentTarget = async (req, res, next) => {
  try {
    const currentTarget = await Target.findOne({
      createdBy: req.userId,
      status: "on going",
    });
    return res.status(200).json(currentTarget);
  } catch (err) {
    next(err);
  }
};
const getSingleTarget = async (req, res, next) => {
  const { id } = req.params;
  try {
    const target = await Target.findOne({ createdBy: req.userId, _id: id });
    target ? res.status(200).json(target) : error400(res, "Invalid target id");
  } catch (err) {
    next(err);
  }
};
const editTarget = async (req, res, next) => {
  const updateTarget = req.target;
  const data = JSON.parse(req.body.json);
  updateOption.forEach((key) => {
    if (data[key] !== undefined) {
      updateTarget[key] = data[key];
    }
  });
  const today = Date.now();
  const startTime = new Date(updateTarget.createdAt).getTime();
  if (checkDate(updateTarget.createdAt) || startTime > today) {
    return error400(res, "Invalid created date");
  }
  if (updateTarget.completedDate) {
    const completeTime = new Date(updateTarget.completedDate).getTime();
    if (checkDate(updateTarget.completedDate) || completeTime < startTime) {
      return error400(res, "Invalid completed date");
    }
  }
  const unlinkImg = updateTarget.img;
  if (req.file) {
    updateTarget.img = `${req.file.filename}`;
  }
  try {
    await updateTarget.save();
    if (unlinkImg && req.file) {
      const folder = __dirname.split("\\");
      folder.pop();
      await fs.unlink(`${folder.join("/")}/public/${unlinkImg}`);
    }
    return res.status(200).json({ msg: "Target updated" });
  } catch (err) {
    next(err);
  }
};
const editStatus = async (req, res, next) => {
  const { id } = req.params;
  const { status } = req.body;
  if (status === "on going") {
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
  }
  if (status === "on going" || status === "abandon") {
    try {
      const updatedTarget = await Target.findOneAndUpdate(
        { createdBy: req.userId, _id: id },
        { status, completedDate: status === "on going" ? null : new Date() },
        { new: true, runValidators: true }
      );
      updatedTarget
        ? res.status(200).json({ msg: "Target updated" })
        : error400(res, "Invalid target id");
    } catch (err) {
      next(err);
    }
  } else if (status === "success") {
    try {
      const updateTarget = await Target.findOne({
        createdBy: req.userId,
        _id: id,
      });
      if (!updateTarget) {
        return error400(res, "Invalid target id");
      }
      const { savingRecord, amount } = updateTarget;
      const savingAmount = savingRecord.reduce((a, c) => {
        a += c.amount;
        return a;
      }, 0);
      if (amount > savingAmount) {
        const newSaving = { date: new Date(), amount: amount - savingAmount };
        updateTarget.savingRecord.push(newSaving);
      }
      updateTarget.status = "success";
      updateTarget.completedDate = new Date();
      await updateTarget.save();
      return res.status(200).json({ msg: "Target status updated" });
    } catch (err) {
      next(err);
    }
  } else {
    return error400(res, "Invalid target status");
  }
};
const removeTarget = async (req, res, next) => {
  const { id } = req.params;
  try {
    const target = await Target.findOneAndDelete({
      createdBy: req.userId,
      _id: id,
    });
    if (target) {
      if (target.img) {
        const folder = __dirname.split("\\");
        folder.pop();
        await fs.unlink(`${folder.join("/")}/public/${target.img}`);
      }
      return res.status(200).json({ msg: "Target removed" });
    } else {
      return error(res, "Invalid target id");
    }
  } catch (err) {
    next(err);
  }
};
const addSavingRecord = async (req, res, next) => {
  const { target } = req;
  const { amount } = req.body;
  target.savingRecord.push({ date: new Date(), amount });
  try {
    await target.save();
    return res.status(201).json({ msg: "Saving Record created" });
  } catch (err) {
    next(err);
  }
};
const editSavingRecord = async (req, res, next) => {
  const { target } = req;
  const { savingId } = req.params;
  const { date, amount } = req.body;
  const savingRecord = target.savingRecord.id(savingId);
  if (!savingRecord) {
    return error400(res, "Invalid saving record id");
  }
  const today = Date.now();
  const startTime = new Date(target.createdAt).getTime();
  const savingTime = new Date(date).getTime();
  if (checkDate(date) || savingTime > today || savingTime < startTime) {
    return error400(res, "Invalid date");
  }
  savingRecord.date = date;
  savingRecord.amount = amount;
  try {
    await target.save();
    return res.status(200).json({ msg: "Saving record updated" });
  } catch (err) {
    next(err);
  }
};
const removeSavingRecord = async (req, res, next) => {
  const { target } = req;
  const { savingId } = req.params;
  const savingRecord = target.savingRecord.id(savingId);
  if (!savingRecord) {
    return error400(res, "Invalid saving record id");
  }
  target.savingRecord.pull(savingId);
  try {
    await target.save();
    return res.status(200).json({ msg: "Saving record removed" });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  addTarget,
  getTargets,
  getCurrentTarget,
  getSingleTarget,
  editTarget,
  editStatus,
  removeTarget,
  addSavingRecord,
  editSavingRecord,
  removeSavingRecord,
};
