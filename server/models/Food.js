const mongoose = require("mongoose");

const foodSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Food name is required"],
      trim: true,
    },
    calories: {
      type: Number,
      required: [true, "Calories are required"],
    },
    suitableWeather: {
      type: [String],
      enum: ["Hot", "Cold", "Rainy", "Sunny", "Windy", "Cloudy", "Any"],
      required: [true, "Suitable weather conditions are required"],
    },
    suitableBmiCategories: {
      type: [String],
      enum: ["Underweight", "Normal", "Overweight", "Obese", "Any"],
      required: [true, "Suitable BMI categories are required"],
    },
    description: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const Food = mongoose.model("Food", foodSchema);

module.exports = Food;
