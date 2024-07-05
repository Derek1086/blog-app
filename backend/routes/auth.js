const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// REGISTER
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    console.log("Attempting to register user:", username);

    // Check if username or email already exists
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      if (existingUser.username === username) {
        console.log("Username already exists:", username);
        return res.status(400).json({ message: "Username already exists" });
      } else if (existingUser.email === email) {
        console.log("Email already exists for user:", username);
        return res.status(400).json({ message: "Email already exists" });
      }
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hashSync(password, salt);
    const newUser = new User({ username, email, password: hashedPassword });
    const savedUser = await newUser.save();
    console.log("User registered successfully:", savedUser.username);
    res.status(200).json(savedUser);
  } catch (err) {
    console.error("Error registering user:", err);
    res.status(500).json(err);
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  try {
    console.log("Attempting to log in user:", req.body.email);
    let user = await User.findOne({ email: req.body.email });

    if (!user) {
      user = await User.findOne({ username: req.body.email });
      if (!user) {
        console.log("User not found:", req.body.email);
        return res.status(404).json("User not found!");
      }
    }

    const match = await bcrypt.compare(req.body.password, user.password);
    if (!match) {
      console.log("Wrong credentials!");
      return res.status(401).json("Wrong credentials!");
    }

    const token = jwt.sign(
      { _id: user._id, username: user.username, email: user.email },
      process.env.SECRET,
      { expiresIn: "3d" }
    );

    const { password, ...info } = user._doc;
    console.log("User logged in successfully:", user.username);
    res.cookie("token", token).status(200).json(info);
  } catch (err) {
    console.error("Error logging in user:", err);
    res.status(500).json(err);
  }
});

// LOGOUT
router.get("/logout", async (req, res) => {
  try {
    console.log("Attempting to log out user");
    res
      .clearCookie("token", { sameSite: "none", secure: true })
      .status(200)
      .send("User logged out successfully!");
    console.log("User logged out successfully");
  } catch (err) {
    console.error("Error logging out user:", err);
    res.status(500).json(err);
  }
});

// REFETCH USER
router.get("/refetch", (req, res) => {
  const token = req.cookies.token;
  console.log("Attempting to refetch user with token");
  jwt.verify(token, process.env.SECRET, {}, async (err, data) => {
    if (err) {
      console.error("Error verifying token:", err);
      return res.status(404).json(err);
    }
    console.log("User data refetched successfully:", data.username);
    res.status(200).json(data);
  });
});

module.exports = router;
