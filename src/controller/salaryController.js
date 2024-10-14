const Emp = require("../model/employeeModel");
const Salary = require("../model/salaryModel");
const InHand = require("../model/inHandModel");

const checkHrRole = (user) => {
  if (user.role !== "hr") {
    throw new Error("Unauthorized User");
  }
};

const calculateInHandSalary = (perDayPay, workingDays) => {
  return (perDayPay * workingDays).toFixed(2);
};

const createSalaryController = async (req, res) => {
  try {
    const user = req.user;
    checkHrRole(user);

    const id = req.params.id;
    if (!id) return res.status(404).json({ message: "No Employee found" });

    const employee = await Emp.findById(id);
    if (!employee)
      return res.status(404).json({ message: "No Employee found" });

    const salary = await Salary.findOne({ employee_id: id });
    if (!salary)
      return res
        .status(404)
        .json({ message: "Salary record not found for the employee" });

    const perDayPay = salary.perDaySalary;
    const { workingDays, month , year } = req.body;

    if (!workingDays)
      return res.status(400).json({ message: "Working days are required" });

    if (workingDays > 24) {
      return res.status(400).json({ message: "Working days cannot be greater than 24" });
    }
    
    const existingEmp = await InHand.findOne({ employee_id: id , month , year});
    if (existingEmp)
      return res.status(403).json({ message: "Salary already exists" });

    const inHandSalary = calculateInHandSalary(perDayPay, workingDays);

    const inHand = new InHand({
      employee_id: id,
      workingDays,
      inHandSalary,
      month,
      year
    });
    await inHand.save();
    
    res.status(201).json({ message: "Salary created successfully", inHand });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: err.message });
  }
};

const updateSalaryController = async (req, res) => {
  try {
    const user = req.user;
    checkHrRole(user);
    const {workingDays,month} = req.body;

    const id = req.params.id;
    if (!id) return res.status(404).json({ message: "No Employee found" });

    const employee = await Emp.findById(id);
    if (!employee)
      return res.status(404).json({ message: "No Employee found" });

    const salary = await Salary.findOne({ employee_id: id });
    if (!salary)
      return res
        .status(404)
        .json({ message: "Salary record not found for the employee" });

    const perDayPay = salary.perDaySalary;

    if (!workingDays)
      return res.status(400).json({ message: "Working days are required" });

    if (workingDays > 24) {
      return res.status(400).json({ message: "Working days cannot be greater than 24" });
    }

    const inHandSalary = calculateInHandSalary(perDayPay, workingDays);
    console.log(inHandSalary);

    const newInhand = await InHand.findOneAndUpdate({employee_id : id},{workingDays,inHandSalary,month},{new:true});
    console.log(newInhand);
    if(!newInhand) return res.status(404).json({message:"New Inhand salary not found"});

    res.status(200).json({Messgae:"Inhand Salary Updated \n"})

  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: err.message });
  }
}

module.exports = { createSalaryController ,updateSalaryController };
