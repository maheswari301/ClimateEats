const User = require("../models/User");
const bcrypt = require("bcrypt");

// Memory storage for users during testing (when MongoDB is not available)
const users = [];
let nextId = 1;

// Make users available globally
global.users = users;

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { name, email, password, weight, age, height } = req.body;

    console.log("Raw request body:", req.body);
    console.log("Extracted name:", name);

    // Validate required fields
    if (!name || !email || !password || !weight || !age || !height) {
      return res.status(400).json({
        message:
          "All fields are required (name, email, password, weight, age, height)",
      });
    }

    // Check if email already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res
        .status(400)
        .json({ message: "User with this email already exists" });
    }

    // Calculate BMI: weight(kg) / (height(m) * height(m))
    const heightInMeters = height / 100; // Convert height from cm to meters
    const bmi = weight / (heightInMeters * heightInMeters);
    const bmiRounded = parseFloat(bmi.toFixed(2));

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    console.log("Attempting to save user to MongoDB:", {
      name,
      email,
      weight,
      age,
      height,
      bmi: bmiRounded,
    });

    // Create user in MongoDB - removed the try/catch to debug any errors
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      weight,
      age,
      bmi: bmiRounded,
    });

    console.log("User saved successfully:", user);

    return res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      weight: user.weight,
      age: user.age,
      bmi: user.bmi,
      bmiCategory: user.bmiCategory,
    });
  } catch (error) {
    console.error("Error saving user:", error);

    // Only use in-memory as fallback if it's a MongoDB connection error
    if (
      error.name === "MongooseServerSelectionError" ||
      error.name === "MongoNetworkError"
    ) {
      console.log("Using in-memory storage as fallback");
      try {
        // Fallback to memory storage if MongoDB is not available
        const { name, email, password, weight, age, height } = req.body;

        // Validate required fields for fallback too
        if (!name || !email || !password || !weight || !age || !height) {
          return res.status(400).json({
            message:
              "All fields are required (name, email, password, weight, age, height)",
          });
        }

        const heightInMeters = height / 100;
        const bmi = weight / (heightInMeters * heightInMeters);
        const bmiRounded = parseFloat(bmi.toFixed(2));

        // Determine BMI category
        let bmiCategory;
        if (bmiRounded < 18.5) {
          bmiCategory = "Underweight";
        } else if (bmiRounded >= 18.5 && bmiRounded < 25) {
          bmiCategory = "Normal";
        } else if (bmiRounded >= 25 && bmiRounded < 30) {
          bmiCategory = "Overweight";
        } else {
          bmiCategory = "Obese";
        }

        // Hash password for in-memory storage too
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = {
          _id: String(nextId++),
          name,
          email,
          password: hashedPassword,
          weight,
          age,
          bmi: bmiRounded,
          bmiCategory,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        users.push(user);

        return res.status(201).json({
          _id: user._id,
          name: user.name,
          email: user.email,
          weight: user.weight,
          age: user.age,
          bmi: user.bmi,
          bmiCategory: user.bmiCategory,
        });
      } catch (fallbackError) {
        console.error("Fallback storage error:", fallbackError);
        return res.status(500).json({
          message: "Could not save user data in memory either.",
        });
      }
    }

    // Return the original error
    res.status(400).json({
      message: error.message,
    });
  }
};

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
const authUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Check if password matches
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Return user data
    return res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      weight: user.weight,
      age: user.age,
      bmi: user.bmi,
      bmiCategory: user.bmiCategory,
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get user profile
// @route   GET /api/users/:id
// @access  Public
const getUserProfile = async (req, res) => {
  try {
    try {
      // Try MongoDB first
      const user = await User.findById(req.params.id);

      if (user) {
        return res.status(200).json({
          _id: user._id,
          name: user.name,
          weight: user.weight,
          age: user.age,
          bmi: user.bmi,
          bmiCategory: user.bmiCategory,
        });
      }
    } catch (dbError) {
      console.log("Using in-memory storage as fallback");
    }

    // Fallback to memory storage
    const user = users.find((u) => u._id === req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      _id: user._id,
      name: user.name,
      weight: user.weight,
      age: user.age,
      bmi: user.bmi,
      bmiCategory: user.bmiCategory,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

module.exports = {
  registerUser,
  getUserProfile,
  authUser,
};
