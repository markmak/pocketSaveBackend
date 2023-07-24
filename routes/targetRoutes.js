const express = require("express");
const router = express.Router();
const { findTarget } = require("../middleware/target");
const {
  getTargets,
  getCurrentTarget,
  editStatus,
  getSingleTarget,
  removeTarget,
  addSavingRecord,
  editSavingRecord,
  removeSavingRecord,
} = require("../controllers/targetController");

router.get("/currentTarget", getCurrentTarget);
router.patch("/:id/status", editStatus);
router.post("/:id/savingRecord", findTarget, addSavingRecord);
router
  .route("/:id/savingRecord/:savingId")
  .patch(findTarget, editSavingRecord)
  .delete(findTarget, removeSavingRecord);
router.route("/:id").get(getSingleTarget).delete(removeTarget);
router.route("/").get(getTargets);

module.exports = router;
