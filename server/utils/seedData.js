const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Food = require("../models/Food");

// Load environment variables
dotenv.config();

// Sample food data
const foods = [
  {
    name: "Salad",
    calories: 150,
    suitableWeather: ["Hot", "Sunny"],
    suitableBmiCategories: ["Overweight", "Obese"],
    description:
      "Fresh vegetables with light dressing, perfect for hot weather.",
  },
  {
    name: "Hot Soup",
    calories: 300,
    suitableWeather: ["Cold", "Rainy"],
    suitableBmiCategories: ["Underweight", "Normal"],
    description: "Warm and comforting soup for cold days.",
  },
  {
    name: "Grilled Chicken",
    calories: 350,
    suitableWeather: ["Any"],
    suitableBmiCategories: ["Normal", "Underweight"],
    description: "Lean protein that can be enjoyed in any weather.",
  },
  {
    name: "Fruit Smoothie",
    calories: 200,
    suitableWeather: ["Hot", "Sunny"],
    suitableBmiCategories: ["Any"],
    description: "Refreshing and nutritious for hot days.",
  },
  {
    name: "Hearty Stew",
    calories: 450,
    suitableWeather: ["Cold", "Rainy", "Cloudy"],
    suitableBmiCategories: ["Underweight"],
    description: "Rich and filling for cold and dreary days.",
  },
  {
    name: "Green Tea",
    calories: 0,
    suitableWeather: ["Any"],
    suitableBmiCategories: ["Any"],
    description: "Hydrating and full of antioxidants.",
  },
  {
    name: "Ice Cream",
    calories: 300,
    suitableWeather: ["Hot", "Sunny"],
    suitableBmiCategories: ["Underweight"],
    description:
      "Sweet treat for hot days, best for those needing to gain weight.",
  },
];

// Get MongoDB URI from environment or use default
const mongoUri = process.env.MONGO_URI
  ? process.env.MONGO_URI.replace("localhost", "127.0.0.1")
  : "mongodb://127.0.0.1:27017/bmi_app";

// Connect to MongoDB
mongoose
  .connect(mongoUri)
  .then(async () => {
    console.log("Connected to MongoDB");

    try {
      // Delete existing records
      await Food.deleteMany({});
      console.log("Deleted existing food data");

      // Insert new data
      await Food.insertMany(foods);
      console.log("Added sample food data");

      console.log("Seed data completed!");
      process.exit(0);
    } catch (error) {
      console.error("Error seeding data:", error);
      process.exit(1);
    }
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  });
