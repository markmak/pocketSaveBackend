const express = require("express");
const router = express.Router();
const {
  getAllTemplates,
  addTemplate,
  editTemplate,
  removeTemplate,
  getRecords,
  addRecord,
  editRecord,
  removeRecord,
} = require("../controllers/recordPageController");

router.route("/template").get(getAllTemplates).post(addTemplate);
router.route("/template/:id").put(editTemplate).delete(removeTemplate);
router.route("/").get(getRecords).post(addRecord);
router.route("/:id").put(editRecord).delete(removeRecord);

module.exports = router;
