const Record = require("../models/records");
const getDashboardData = async (req, res, next) => {
  try {
    const data = await Record.find({ createdBy: req.userId }).select(
      "recordType date type amount"
    );
    res.status(200).json(data);
  } catch (err) {
    next(err);
  }
};

module.exports = getDashboardData;
