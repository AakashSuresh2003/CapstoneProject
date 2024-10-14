const express = require("express");
const {
  registerController,
  loginController,
  logoutController,
} = require("../controller/authController");

const authMiddleware = require("../middleware/authMiddle")

const {checkAdminAndHrRole} = require("../middleware/accessMiddle")

const router = express.Router();

router.post("/register",authMiddleware ,checkAdminAndHrRole , registerController);

router.post("/login", loginController);

router.get("/logout", logoutController);

module.exports = router;
