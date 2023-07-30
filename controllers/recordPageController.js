const Template = require("../models/templates");
const Record = require("../models/records");
const { incomeTypes, expenseTypes } = require("../lookup");
const { error400 } = require("../error/error");
const { checkDate } = require("../lookup");
const checkType = (type, recordType) => {
  return (
    (recordType === "income" && !incomeTypes.includes(type)) ||
    (recordType === "expense" && !expenseTypes.includes(type))
  );
};

const getAllTemplates = async (req, res, next) => {
  try {
    const templateList = await Template.find({ createdBy: req.userId })
      .sort({
        createdAt: 1,
      })
      .select("_id templateName recordType date name type amount comment");
    res.status(200).json(templateList);
  } catch (err) {
    next(err);
  }
};
const addTemplate = async (req, res, next) => {
  const { templateName, recordType, date, name, type, amount, comment } =
    req.body;
  const count = await Template.countDocuments({ createdBy: req.userId });
  if (count > 15) {
    return error400(
      res,
      "You have reached the maximum limit of 15 templates. Please delete a template before adding a new one."
    );
  }
  if (type) {
    if (checkType(type, recordType)) {
      return error400(res, "Invalid type");
    }
  }
  if (date) {
    if (checkDate(date)) {
      return error400(res, "Invalid Date");
    }
  }
  try {
    await Template.create({
      templateName,
      recordType,
      date,
      name,
      type,
      amount,
      comment,
      createdBy: req.userId,
    });
    res.status(201).json({ msg: "template created" });
  } catch (err) {
    next(err);
  }
};
const editTemplate = async (req, res, next) => {
  const templateId = req.params.id;
  const { templateName, recordType, date, name, type, amount, comment } =
    req.body;
  if (type) {
    if (checkType(type, recordType)) {
      return error400(res, "Invalid type");
    }
  }
  if (date) {
    if (checkDate(date)) {
      return error400(res, "Invalid Date");
    }
  }
  try {
    const updatedTemplate = await Template.findOneAndReplace(
      { _id: templateId, createdBy: req.userId },
      {
        templateName,
        recordType,
        date,
        name,
        type,
        amount,
        comment,
        createdBy: req.userId,
      },
      { new: true, runValidators: true }
    );
    updatedTemplate
      ? res.status(200).json({ msg: "template updated" })
      : error400(res, "Invalid template id");
  } catch (err) {
    next(err);
  }
};
const removeTemplate = async (req, res) => {
  const templateId = req.params.id;
  try {
    const removedTemplate = await Template.findOneAndDelete({
      _id: templateId,
      createdBy: req.userId,
    });
    removedTemplate
      ? res.status(200).json({ msg: "template deleted" })
      : error400(res, "Invalid template id");
  } catch (err) {
    next(err);
  }
};
const getRecords = async (req, res, next) => {
  const { startDate, endDate, recordType, type, name, page } = req.query;
  const findObject = { createdBy: req.userId };
  if (startDate || endDate) {
    const date = {};
    if (!checkDate(startDate) && startDate) {
      date.$gte = startDate;
    }
    if (!checkDate(endDate) && endDate) {
      date.$lte = endDate;
    }
    if (date.$gte || date.$lte) {
      findObject.date = date;
    }
  }
  if (recordType) {
    findObject.recordType = recordType;
  }
  if (type) {
    findObject.type = type;
  }
  if (name) {
    findObject.name = { $regex: name, $options: "i" };
  }
  const skip = (page - 1) * 20;
  const queryTotalCount = Record.countDocuments({ createdBy: req.userId });
  const queryData = Record.find(findObject)
    .sort({ date: -1 })
    .skip(skip)
    .limit(20);
  const queryCount = Record.countDocuments(findObject);
  try {
    const [totalCount, data, count] = await Promise.all([
      queryTotalCount,
      queryData,
      queryCount,
    ]);
    res.status(200).json({ totalCount, data, count });
  } catch (err) {
    console.log(err);
    next(err);
  }
};
const addRecord = async (req, res, next) => {
  const { recordType, date, name, type, amount, comment } = req.body;
  if (checkType(type, recordType)) {
    return error400(res, "Invalid type");
  }
  if (checkDate(date)) {
    return error400(res, "Invalid date");
  }
  try {
    await Record.create({
      recordType,
      date,
      name,
      type,
      amount,
      comment,
      createdBy: req.userId,
    });
    res.status(201).json({ msg: "record created" });
  } catch (err) {
    next(err);
  }
};
const editRecord = async (req, res, next) => {
  const recordId = req.params.id;
  const { recordType, date, name, type, amount, comment } = req.body;
  if (checkType(type, recordType)) {
    return error400(res, "Invalid type");
  }
  if (checkDate(date)) {
    return error400(res, "Invalid date");
  }
  try {
    const updatedRecord = await Record.findOneAndReplace(
      { _id: recordId, createdBy: req.userId },
      {
        recordType,
        date,
        name,
        type,
        amount,
        comment,
        createdBy: req.userId,
      },
      { new: true, runValidators: true }
    );
    updatedRecord
      ? res.status(200).json({ msg: "record updated" })
      : error400(res, "Invalid record id");
  } catch (err) {
    next(err);
  }
};
const removeRecord = async (req, res, next) => {
  const recordId = req.params.id;
  try {
    const removedRecord = await Record.findOneAndRemove({
      _id: recordId,
      createdBy: req.userId,
    });
    removedRecord
      ? res.status(200).json({ msg: "record removed" })
      : error400(res, "Invalid record id");
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllTemplates,
  addTemplate,
  editTemplate,
  removeTemplate,
  getRecords,
  addRecord,
  editRecord,
  removeRecord,
};
