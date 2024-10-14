const Emp = require("../model/employeeModel");
const AllowencePercentage = require("../model/allowencePercentageModel");
const Salary = require("../model/salaryModel");
const InHand = require("../model/inHandModel");
const PaySlip = require("../model/paySlip");

const getAllEmployeeController = async (req, res) => {
  try {
    const employees = await Emp.find();
    if (!employees)
      return res.status(404).json({ Message: "No Employees found" });
    res.status(200).json(employees);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};

const getEmployeeByIdController = async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) return res.status(404).json({ Message: "No Employee found" });
    const employee = await Emp.findById(id);
    if (!employee)
      return res.status(404).json({ Message: "No Employee found" });
    res.status(200).json(employee);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};

const createEmployeeController = async (req, res) => {
  try {
    const { name, email, emp_id, Role, base_pay } = req.body;
    const { rollName, emp_grade } = Role;

    const existingEmp = await Emp.findOne({ $or: [{ email }, { emp_id }] });
    if (existingEmp)
      return res.status(403).json({ Message: "Employee already exists" });

    const newEmployee = await Emp({ ...req.body });

    await newEmployee.save();
    res.status(201).json({
      message: "Employee created successfully",
      employee: newEmployee,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};

const updateEmployeeController = async (req, res) => {
  try {
    const { name, email, Role, base_pay } = req.body;
    const id = req.params.id;

    if (!id) {
      return res.status(400).json({ Message: "Employee ID is required" });
    }

    const updateDetails = await Emp.findByIdAndUpdate(
      id,
      { name, email, Role, base_pay },
      { new: true }
    );

    if (!updateDetails) {
      return res.status(404).json({ Message: "Employee not found" });
    }

    res
      .status(200)
      .json({
        Message: "Employee updated successfully",
        updatedEmployee: updateDetails,
      });
  } catch (err) {
    console.error("Error updating employee:", err);
    res.status(500).json({ Message: "Internal server error" });
  }
};

const deleteEmployeeController = async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) {
      return res.status(404).json({ message: "Employee not found" });
    }

    const deleteEmployee = await Emp.findByIdAndDelete(id);
    const deleteSalary = await Salary.findOneAndDelete({ employee_id: id });
    const deleteInHand = await InHand.findOneAndDelete({ employee_id: id });
    const deletePaySlip = await PaySlip.findOneAndDelete({ employee_id: id });

    if (!deleteEmployee) {
      return res
        .status(404)
        .json({ message: "Employee not found or unauthorized to delete" });
    }
    if (!deleteSalary) {
      return res.status(404).json({ message: "Salary not found" });
    }
    if (!deleteInHand) {
      return res.status(404).json({ message: "InHand not found" });
    }
    if(!deletePaySlip) return res.status(404).json({message:"Payslip not found"});

    res
      .status(200)
      .json({ message: "Successfully Deleted Employee", deleteEmployee });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const getAllowencePercentage = async (req, res) => {
  try {
    const grades = await AllowencePercentage.find();
    if (!grades.length) {
      return res.status(404).json("Allowance percentage not found");
    }

    res.status(200).json(grades);
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: err.message });
  }
};

const createAllowencePercentage = async (req, res) => {
  try {
    const { grade, HRA, DA, MA } = req.body;
    const allowence = await AllowencePercentage.findOne({ grade });
    if (allowence) {
      return res.status(400).json({ message: "Allowence already exists" });
    }
    const newAllowence = await AllowencePercentage({ grade, HRA, DA, MA });
    await newAllowence.save();
    res
      .status(201)
      .json({ message: "Allowence created successfully", newAllowence });
  } catch (err) {
    console.log(err);
    res.status(500).json("Internal Server Error");
  }
};

const updateAllowencePercentage = async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) return res.status(404).json({ message: "Allowence not found" });

    const { HRA, DA, MA } = req.body;
    const allowence = await AllowencePercentage.findByIdAndUpdate(
      id,
      {
        HRA,
        DA,
        MA,
      },
      { new: true }
    );
    if (!allowence)
      return res.status(404).json({ message: "Allowence not found" });
    res.status(200).json({ Message: "Allowence updated successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json("Internal Server Error");
  }
};

const calculateSalaryComponents = (basePay, grade) => {
  const HRA = basePay * grade.HRA;
  const DA = basePay * grade.DA;
  const MA = basePay * grade.MA;
  const perDaySalary = ((basePay + HRA + DA + MA) / 24).toFixed(2);

  return { HRA, DA, MA, perDaySalary };
};

const calculateSalaryController = async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) {
      return res.status(404).json({ message: "Employee not found" });
    }

    const employee = await Emp.findById(id);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    const grade = await AllowencePercentage.findOne({
      grade: employee.Role.emp_grade,
    });

    if (!grade) {
      return res.status(404).json({ message: "Grade not found" });
    }

    const existingSalary = await Salary.findOne({ employee_id: employee._id });
    if (existingSalary) {
      return res
        .status(400)
        .json({ message: "Salary for this employee already exists" });
    }

    const basePay = employee.base_pay;
    const salaryComponents = calculateSalaryComponents(basePay, grade);

    const salary = new Salary({
      employee_id: employee._id,
      ...salaryComponents,
    });

    await salary.save();
    res
      .status(201)
      .json({ message: "Salary calculated and saved successfully", salary });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};

module.exports = {
  getAllEmployeeController,
  getEmployeeByIdController,
  createEmployeeController,
  updateEmployeeController,
  deleteEmployeeController,
  createAllowencePercentage,
  updateAllowencePercentage,
  calculateSalaryController,
  getAllowencePercentage,
};
