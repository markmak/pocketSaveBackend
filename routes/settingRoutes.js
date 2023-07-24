const express = require("express");
const router = express.Router();
const {
  changeUserInfo,
  changePassword,
  removeIcon,
} = require("../controllers/settingController");

router.patch("/userInfo", changeUserInfo);
router.patch("/password", changePassword);
router.delete("/icon", removeIcon);

module.exports = router;
