/**
 * Script to check all existing users in the database
 */

const mongoose = require("mongoose");
const dotenv = require("dotenv");
const User = require("../models/User");

// Load environment variables
dotenv.config();

// MongoDB connection
const mongoUri = process.env.MONGO_URI

async function checkUsers() {
  try {
    // Connect to MongoDB
    console.log("Connecting to MongoDB...");
    await mongoose.connect(mongoUri);
    console.log("Connected to MongoDB");

    // Find all users
    const users = await User.find({}).sort({ createdAt: -1 });

    console.log(`Found ${users.length} users in the database:`);

    users.forEach((user, index) => {
      console.log(`\nUser ${index + 1}:`);
      console.log(`ID: ${user._id}`);
      console.log(`Name: ${user.name || "NOT SET"}`);
      console.log(`Weight: ${user.weight}`);
      console.log(`Age: ${user.age}`);
      console.log(`BMI: ${user.bmi}`);
      console.log(`BMI Category: ${user.bmiCategory}`);
      console.log(`Created: ${user.createdAt}`);
    });

    // Close connection
    await mongoose.connection.close();
    console.log("\nConnection closed");
  } catch (error) {
    console.error("Error:", error);

    // Close connection if open
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
    }
  }
}

// Run the function
checkUsers();
