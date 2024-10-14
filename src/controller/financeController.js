const Salary = require("../model/salaryModel");
const InHand = require("../model/inHandModel");
const PaySlip = require("../model/paySlip");

const generatePayController = async (req, res) => {
  try {
    const salaries = await InHand.find();

    const perDaySal = await Salary.find();

    if(salaries.length !== perDaySal.length) return res.status(400).json({message:"Please add per day salary for all employees"});

    if (!salaries || salaries.length === 0) {
      return res.status(404).json({message:"No Salaries found"});
    }

    const existingPaySlips = await PaySlip.find({}, { employee_id: 1, month: 1 });
    
    const existingEmployeeMonths = existingPaySlips.map((paySlip) => ({
      employee_id: paySlip.employee_id.toString(),
      month: paySlip.month,
    }));

    const salariesWithPerDay = await Promise.all(
      salaries.map(async (salary) => {
        const salaryDetails = await Salary.findOne({
          employee_id: salary.employee_id,
        }).select("perDaySalary");
        console.log("Salary Details: "+salaryDetails);
        return {
          ...salary.toObject(),
          perDaySalary: salaryDetails.perDaySalary ,
        };
      })
    );

    const newData = await Promise.all(
      salariesWithPerDay.map(async (data) => {
        console.log(data.employee_id);
        const isAvailable = await PaySlip.findOne({
          employee_id: data.employee_id,
          month: data.month,
        });

        if (!isAvailable) {
          console.log(data.perDaySalary);
          return {
            employee_id: data.employee_id,
            workingDays: data.workingDays,
            perDaySalary: data.perDaySalary,
            monthlySalary: data.inHandSalary,
            month: data.month,
            year: data.year,
          };
        }
      })
    );

    const newDataFiltered = newData.filter((data) => data !== undefined);
    console.log(newDataFiltered);

    if (newDataFiltered.length > 0) {
      await PaySlip.create(newDataFiltered);
      return res.status(200).json({message:"Salaries calculated and saved successfully"});
    } else {
      return res.status(200).json("No new salary to calculate or save");
    }
  } catch (err) {
    console.error("Error in generatePayController:", err);
    res.status(500).json({error : "Internal server error"});
  }
};

const getSalariesController = async (req, res) => {
  try {
    const pay = await PaySlip.find();
    if (!pay) return res.status(404).json({ Message: "Salaries not found" });
    res.status(200).json(pay);
  } catch (err) {
    console.log(err);
    res.status(500).json({error:"Internal Server Error"});
  }
};

const getSalaryByIdController = async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) return res.status(400).json({message:"Employee ID is required"});

    const salary = await InHand.findOne({ employee_id: id });
    if (!salary)
      return res.status(404).json({message:"Salary not found for the given Employee ID"});

    const salaryDetails = await PaySlip.findOne({ employee_id: id });

    res.status(200).json(salaryDetails);
  } catch (err) {
    console.log(err);
    res.status(500).json({error:"Internal Server Error"});
  }
};

const getTotalSalaryController = async (req, res) => {
  try {
    const total = await PaySlip.aggregate([
      {
        $group: {
          _id: null,
          totalNetPay: { $sum: "$monthlySalary" },
        },
      },
    ]);

    if (!total) return res.status(404).json({message:"No Salaries found"});

    const totalSalary = parseFloat((total[0].totalNetPay).toFixed(2));
    res.status(200).json({ totalSalary });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};

module.exports = {
  getSalariesController,
  getSalaryByIdController,
  getTotalSalaryController,
  generatePayController,
};
