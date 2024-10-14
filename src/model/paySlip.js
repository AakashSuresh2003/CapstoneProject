const mongoose = require("mongoose");

const paySlipSchema = new mongoose.Schema({
  employee_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employee",
    required: true,
  },
  workingDays: {
    type: Number,
    required: true,
  },
  perDaySalary: {
    type: Number,
    required: true,
  },
  monthlySalary: {
    type: Number,
    required: true,
  },
  month: {
    type: String,
    required: true,
    lowercase: true,
  },
  year: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("PaySlip", paySlipSchema);
