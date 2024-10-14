const mongoose = require("mongoose");

const allowencePercentageSchema = mongoose.Schema({
    grade:{
        type: String,
        required: true
    },
    HRA: {
        type: Number,
        required: true
    },
    DA: {
        type: Number,
        required: true
    },
    MA: {
        type: Number,
        required: true
    }
})

module.exports = mongoose.model("AllowencePercentage", allowencePercentageSchema);