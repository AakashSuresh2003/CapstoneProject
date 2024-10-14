const mongoose = require("mongoose");

const salarySchema = mongoose.Schema(
  {
    employee_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    HRA: {
      type: Number,
      required: true,
    },
    DA: {
      type: Number,
      required: true,
    },
    MA: {
      type: Number,
      required: true,
    },
    perDaySalary: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Salary", salarySchema);
