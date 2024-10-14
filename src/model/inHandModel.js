const mongoose = require("mongoose");

const inHandSchema = mongoose.Schema(
    {
        employee_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Employee",
            required: true,
        },
        workingDays: {
            type: Number,
            required: true,
        },
        inHandSalary: {
            type: Number,
            required: true,
        },
        month: {
            type: String,
            required: true,
        },
        year: {
            type: Number,
            required: true,
            validate: {
                validator: function(v) {
                  const currentYear = new Date().getFullYear();
                  return v === currentYear;
                },
                message: props => `${props.value} is not the current year!`
              }
        }
    }
)

module.exports = mongoose.model("InHand", inHandSchema);