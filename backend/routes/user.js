const express = require("express");
const zod = require("zod");
const jwt = require("jsonwebtoken");
const { User, Account } = require("../db");
const { JWT_SECRET } = require("../config");
const { authMiddleware } = require("../middleware");

const router = express.Router();

// Define a Zod schema for user input validation
const signupSchema = zod.object({
  firstName: zod.string(),
  lastName: zod.string(),
  userName: zod.string().email(),
  password: zod.string(),
});

router.post("/signup", async (req, res) => {
  try {
    //Validating user input
    const { firstName, lastName, userName, password } = signupSchema.parse(
      req.body
    );

    //Check if user already exists in database
    const existingUser = await User.findOne({ userName });
    if (existingUser) {
      return res.status(409).json({ error: "User already exists" });
    }

    //Create a new user
    const newUser = new User({
      firstName,
      lastName,
      userName,
      password,
    });
    await newUser.save();

    const userId = newUser._id;

    // Create New Account
    await Account.create({
      userId,
      balance: 1 + Math.random() * 10000,
    });

    //Generate JWT token with user ID
    const token = jwt.sign({ userId }, JWT_SECRET);

    //Return JWT token in the response
    res
      .status(200)
      .json({ message: "User created successfully", token: token });
  } catch (error) {
    //Handle Validation Error
    if (error instanceof zod.ZodError) {
      return res.status(400).json({ error: error.errors });
    }

    //Handle other errors
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

const signinSchema = zod.object({
  userName: zod.string().email(),
  password: zod.string(),
});

// Sign-in route
router.post("/signin", async (req, res) => {
  try {
    // Validate user input
    const { userName, password } = signinSchema.parse(req.body);

    // Check if the user exists in the database
    const user = await User.findOne({ userName });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check if the password is correct
    if (user.password !== password) {
      // Note: In production, hash the password and compare the hashed values
      return res.status(401).json({ error: "Invalid password" });
    }

    // Generate JWT token with user ID
    const token = jwt.sign({ userId: user._id }, JWT_SECRET);

    // Return JWT token in the response
    res
      .status(200)
      .json({ message: "User Signed-In successfully", token: token });
  } catch (error) {
    // Handle validation errors
    if (error instanceof zod.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    // Handle other errors
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
