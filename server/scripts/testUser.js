/**
 * Quick test for user creation with fixed User model
 */

const mongoose = require("mongoose");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config();

// Import User model
const User = require("../models/User");

// MongoDB connection
const mongoUri = process.env.MONGO_URI

console.log("Connecting to MongoDB...");

// Test user creation
async function testUserCreation() {
  try {
    // Connect to MongoDB
    await mongoose.connect(mongoUri);
    console.log("Connected to MongoDB");

    // Try to create a user with just the required fields
    const userData = {
      name: "Test User",
      weight: 65,
      age: 28,
      bmi: 22.3,
    };

    console.log("Creating user with data:", userData);

    const user = await User.create(userData);

    console.log("User created successfully!");
    console.log({
      id: user._id,
      name: user.name,
      weight: user.weight,
      age: user.age,
      bmi: user.bmi,
      bmiCategory: user.bmiCategory,
      createdAt: user.createdAt,
    });

    // Close connection
    await mongoose.connection.close();
    console.log("Test completed successfully");
  } catch (error) {
    console.error("Error during test:", error);

    // Close connection
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
    }
  }
}

// Run the test
testUserCreation();
