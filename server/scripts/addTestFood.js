/**
 * Add a single test food item
 */

const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Food = require("../models/Food");

// Load environment variables
dotenv.config();

// Sample food item
const sampleFood = {
  name: "Pizza",
  calories: 300,
  suitableWeather: ["Any"],
  suitableBmiCategories: ["Any"],
  description: "Everyone's favorite food - pizza works in any weather!",
};

// MongoDB connection
const mongoUri = process.env.MONGO_URI

console.log("Connecting to MongoDB...");

// Create and save the food item
async function addTestFood() {
  try {
    // Connect to MongoDB
    await mongoose.connect(mongoUri);
    console.log("Connected to MongoDB");

    // Create the food item
    const food = await Food.create(sampleFood);

    console.log("Food added successfully!");
    console.log({
      id: food._id,
      name: food.name,
      calories: food.calories,
      suitableWeather: food.suitableWeather,
      suitableBmiCategories: food.suitableBmiCategories,
    });

    // Get all foods to verify
    const allFoods = await Food.find().select("name");
    console.log("\nAll foods in database:");
    allFoods.forEach((f) => console.log(`- ${f.name} (${f._id})`));

    // Close connection
    await mongoose.connection.close();
    console.log("\nDone!");
  } catch (error) {
    console.error("Error:", error);
    // Close connection
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
    }
  }
}

// Run the function
addTestFood();
