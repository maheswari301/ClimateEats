/**
 * Script to update any existing users that don't have the name field
 */

const mongoose = require("mongoose");
const dotenv = require("dotenv");
const User = require("../models/User");

// Load environment variables
dotenv.config();

// MongoDB connection
const mongoUri = process.env.MONGO_URI

async function updateUsers() {
  try {
    // Connect to MongoDB
    console.log("Connecting to MongoDB...");
    await mongoose.connect(mongoUri);
    console.log("Connected to MongoDB");

    // Find users without name or with empty name
    const usersToUpdate = await User.find({
      $or: [{ name: { $exists: false } }, { name: null }, { name: "" }],
    });

    console.log(`Found ${usersToUpdate.length} users without a name.`);

    if (usersToUpdate.length > 0) {
      for (const user of usersToUpdate) {
        const defaultName = `User-${user._id.toString().slice(-4)}`;

        console.log(
          `Updating user ${user._id} with default name: ${defaultName}`
        );

        user.name = defaultName;
        await user.save();

        console.log(`User updated successfully!`);
      }

      console.log("\nAll users have been updated with default names.");
    } else {
      console.log("All users already have names - no updates needed.");
    }

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
updateUsers();
