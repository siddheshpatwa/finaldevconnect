const asynchandler = require("express-async-handler");
const User = require("../Models/Users");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


const registerUser = asynchandler(async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      res.status(400);
      throw new Error("Please fill all the fields");
    }
    // Check if user already exists
    const userExists = await User.findOne({ email, name }); // Use findOne, not find
    if (userExists) {
      res.status(400);
      throw new Error("User already exists");
      return;
    }
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });
    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        name: user.name, // ✅ include this if needed later
      },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );
    return res.status(201).json({
      name: user.name,
      email: user.email,
      token,
      message: "User created successfully",
    });
  } catch (error) {
    throw new Error(error.message || "Server error");
    // console.error("Error during registration:", error.message);
    res.status(500).json({ message: error.message || "Server error" });
  }
});

const loginUser = asynchandler(async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400);
      throw new Error("Please fill all the fields");
    }
    const user = await User.findOne({ email });
    if (!user) {
      res.status(400);
      throw new Error("User not found");
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(400);
      throw new Error("Invalid credentials");
    }
    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        name: user.name, // ✅ include this if needed later
      },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );
    return res.status(200).json({
      name: user.name,
      email: user.email,
      token,
      message: "Login successful",
    });
  } catch (error) {
    // console.error("Error during login:", error.message);
    throw new Error(error.message || "Server error");
    res.status(500).json({ message: error.message || "Server error" });
  }
});


const getCurrentUser = asynchandler(async (req, res) => {
  try {
    // res.status(200).json({ message: 'Current user data' });
    const { name, email } = req.user;
    res.status(200).json({ name, email });
  } catch (error) {
    throw new Error(error.message || "Error fetching current user");
    res.status(500).json({ message: 'Error fetching current user.', error: error.message });
  }
})

module.exports = {
  registerUser,
  loginUser,
  getCurrentUser
};
