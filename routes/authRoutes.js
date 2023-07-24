const express = require("express");
const router = express.Router();

const {
  register,
  login,
  logout,
  getUser,
} = require("../controllers/authController");
const auth = require("../middleware/auth");

router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);
router.get("/getUser", auth, getUser);

module.exports = router;
