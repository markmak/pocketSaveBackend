const incomeTypes = [
  "full time salary",
  "investment income",
  "part time salary",
  "others",
];
const expenseTypes = [
  "bills",
  "entertainment",
  "food",
  "investment",
  "rent",
  "tax",
  "travel",
  "others",
];
const updateOption = [
  "img",
  "name",
  "amount",
  "createdAt",
  "completedDate",
  "targetSavingPeriod",
  "comment",
];
const checkDate = (date) => {
  return isNaN(new Date(date).valueOf());
};
module.exports = { incomeTypes, expenseTypes, updateOption, checkDate };
