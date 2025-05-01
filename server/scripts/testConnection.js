/**
 * MongoDB Connection Test
 *
 * This script tests the MongoDB connection and creates a test user
 * Run it with: node scripts/testConnection.js
 */

const mongoose = require("mongoose");
const dotenv = require("dotenv");
const User = require("../models/User");

// Load environment variables
dotenv.config();

// MongoDB connection
const mongoUri = process.env.MONGO_URI

console.log("Connecting to MongoDB...");

async function testConnection() {
  try {
    // Connect to MongoDB
    await mongoose.connect(mongoUri);
    console.log("Connected to MongoDB");

    // Test User creation with name field
    console.log("Testing User creation with name field...");

    try {
      const testUser = await User.create({
        name: "Test Connection User",
        weight: 70,
        age: 30,
        bmi: 24.5,
      });

      console.log("Test user created successfully:", testUser);

      // Verify name is stored
      const fetchedUser = await User.findById(testUser._id);
      console.log("Retrieved user from DB:", fetchedUser);

      if (fetchedUser.name === "Test Connection User") {
        console.log("✅ Name field is working properly!");
      } else {
        console.log("❌ Name field is not stored correctly!");
      }

      // Clean up test user
      await User.findByIdAndDelete(testUser._id);
      console.log("Test user removed from database");
    } catch (userError) {
      console.error("Error testing User model:", userError);
    }

    // Close connection
    await mongoose.connection.close();
    console.log("Connection closed");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    // Close connection if open
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
    }
  }
}

// Run the test
testConnection();
