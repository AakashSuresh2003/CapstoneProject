const User = require("../model/userModel");
const InitialData = require("../db/initialData");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const registerController = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ Message: "User already exists" });
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hashSync(password, salt);
    const newUser = await User({ ...req.body, password: hashedPassword });
    await newUser.save();
    const { password: _, ...userDataWithoutPassword } = newUser._doc;
    res.status(200).json(userDataWithoutPassword);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};

const loginController = async (req, res) => {
  try {
    let users = await User.find();

    if (users.length === 0) {
      const initialUser = InitialData;
      const { name, email, password, role } = initialUser;
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const newUser = new User({ name, email, password: hashedPassword, role });
      await newUser.save();

      return res.status(201).json({
        message: "Initial user created. Please try logging in again.",
      });
    }

    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User does not exist" });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      return res.status(401).json({ message: "Invalid password" });

    const { password: _, ...userData } = user._doc;
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES,
    });

    res
      .cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "None",
      })
      .status(200)
      .json(userData);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};

const logoutController = async (req, res) => {
  try {
    res
      .clearCookie("token", { sameSite: true, secure: true })
      .status(200)
      .json({ Message: "Logged Out" });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};

module.exports = { registerController, loginController, logoutController };
