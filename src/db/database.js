const mongoose = require("mongoose");

const ConnectDB = async (req,res) => {
  try {
    // const connect = await mongoose.connect(process.env.MONGO_URI);
    const connect = await mongoose.connect('mongodb+srv://Admin:zBb69gdRH84kWerp@cluster0.k89bn4a.mongodb.net/PayRoll?retryWrites=true&w=majority&appName=Cluster0');
    console.log(
      "Database Connected : ",
      connect.connection.host,
      connect.connection.name
    );
  } catch (err) {
    console.log(err);
  }
};

module.exports = ConnectDB;