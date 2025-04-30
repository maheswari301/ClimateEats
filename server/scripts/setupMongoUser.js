/**
 * MongoDB Setup Script
 *
 * This script can be used to initialize your MongoDB database with test users.
 * First, update your .env file with a valid MongoDB URI, then run:
 * node scripts/setupMongoUser.js
 */

const mongoose = require("mongoose");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config();

// Import models
const User = require("../models/User");

// Test user data
const testUsers = [
  {
    weight: 70,
    age: 25,
    bmi: 22.5, // This will be calculated for real users
  },
  {
    weight: 85,
    age: 35,
    bmi: 27.8,
  },
  {
    weight: 55,
    age: 22,
    bmi: 18.1,
  },
];

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("Connected to MongoDB");

    try {
      // Clear existing users (optional, remove this if you want to keep existing data)
      await User.deleteMany({});
      console.log("Cleared existing users");

      // Insert test users
      const users = await User.create(testUsers);
      console.log(`Created ${users.length} test users:`);

      // Output created users and their IDs
      users.forEach((user) => {
        console.log(
          `- User ID: ${user._id}, BMI: ${user.bmi}, Category: ${user.bmiCategory}`
        );
      });

      console.log("\nYou can use these IDs to test your application.");
      console.log("Setup completed successfully!");
    } catch (error) {
      console.error("Error setting up database:", error);
    } finally {
      // Close the connection
      mongoose.connection.close();
      process.exit(0);
    }
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  });
