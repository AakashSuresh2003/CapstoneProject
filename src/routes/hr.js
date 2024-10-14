const express = require("express");
const { createSalaryController, updateSalaryController } = require("../controller/salaryController");
const authMiddleware = require("../middleware/authMiddle");
const router = express.Router();

router.use(authMiddleware);

router.post("/create-salary/:id", createSalaryController);

router.put("/update-salary/:id", updateSalaryController);

module.exports = router;
