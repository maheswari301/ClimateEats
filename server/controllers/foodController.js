const Food = require("../models/Food");
const axios = require("axios");

// Sample food data for testing (when MongoDB is not available)
const sampleFoods = [
  {
    _id: "1",
    name: "Salad",
    calories: 150,
    suitableWeather: ["Hot", "Sunny"],
    suitableBmiCategories: ["Overweight", "Obese"],
    description:
      "Fresh vegetables with light dressing, perfect for hot weather.",
  },
  {
    _id: "2",
    name: "Hot Soup",
    calories: 300,
    suitableWeather: ["Cold", "Rainy"],
    suitableBmiCategories: ["Underweight", "Normal"],
    description: "Warm and comforting, ideal for cold days.",
  },
  {
    _id: "3",
    name: "Ice Cream",
    calories: 350,
    suitableWeather: ["Hot"],
    suitableBmiCategories: ["Underweight"],
    description: "Cold and sweet treat for hot days.",
  },
  {
    _id: "4",
    name: "Grilled Chicken",
    calories: 250,
    suitableWeather: ["Any"],
    suitableBmiCategories: ["Normal", "Overweight"],
    description: "Lean protein source suitable for most weather conditions.",
  },
  {
    _id: "5",
    name: "Fruit Smoothie",
    calories: 200,
    suitableWeather: ["Hot", "Sunny"],
    suitableBmiCategories: ["Any"],
    description: "Refreshing and nutritious drink for warm weather.",
  },
  {
    _id: "6",
    name: "Oatmeal",
    calories: 180,
    suitableWeather: ["Cold"],
    suitableBmiCategories: ["Overweight", "Obese"],
    description: "Warm and filling breakfast for cold mornings.",
  },
  {
    _id: "7",
    name: "Pasta",
    calories: 320,
    suitableWeather: ["Any"],
    suitableBmiCategories: ["Underweight", "Normal"],
    description: "Versatile and energy-rich meal for any weather.",
  },
  {
    _id: "8",
    name: "Stew",
    calories: 280,
    suitableWeather: ["Cold", "Rainy"],
    suitableBmiCategories: ["Any"],
    description: "Hearty and warming dish for cold or rainy days.",
  },
  {
    _id: "9",
    name: "Yogurt",
    calories: 120,
    suitableWeather: ["Hot", "Sunny"],
    suitableBmiCategories: ["Overweight", "Obese"],
    description: "Cool and probiotic-rich snack for hot weather.",
  },
  {
    _id: "10",
    name: "Grilled Fish",
    calories: 220,
    suitableWeather: ["Any"],
    suitableBmiCategories: ["Normal", "Overweight"],
    description: "Light and protein-rich meal suitable for any weather.",
  },
  {
    _id: "11",
    name: "Vegetable Curry",
    calories: 260,
    suitableWeather: ["Cold", "Rainy"],
    suitableBmiCategories: ["Any"],
    description: "Spicy and warming dish for cold days.",
  },
  {
    _id: "12",
    name: "Watermelon",
    calories: 90,
    suitableWeather: ["Hot", "Sunny"],
    suitableBmiCategories: ["Any"],
    description: "Hydrating and refreshing fruit for hot weather.",
  },
  {
    _id: "13",
    name: "Hot Chocolate",
    calories: 200,
    suitableWeather: ["Cold"],
    suitableBmiCategories: ["Underweight"],
    description: "Sweet and warming beverage for cold days.",
  },
  {
    _id: "14",
    name: "Idli",
    calories: 150,
    suitableWeather: ["Any"],
    suitableBmiCategories: ["Overweight", "Obese"],
    description: "Soft steamed rice cakes, light and healthy breakfast.",
  },
  {
    _id: "15",
    name: "Dosa",
    calories: 180,
    suitableWeather: ["Any"],
    suitableBmiCategories: ["Normal"],
    description: "Crispy rice crepe, a South Indian staple.",
  },
  {
    _id: "16",
    name: "Curd Rice",
    calories: 200,
    suitableWeather: ["Hot"],
    suitableBmiCategories: ["Any"],
    description: "Cooling and soothing dish for hot weather.",
  },
  {
    _id: "17",
    name: "Rasam",
    calories: 100,
    suitableWeather: ["Rainy"],
    suitableBmiCategories: ["Any"],
    description: "Spicy, tangy soup, good for digestion and immunity.",
  },
];

// @desc    Check if a food is suitable for current weather and user's BMI
// @route   POST /api/foods/check
// @access  Private
const checkFoodSuitability = async (req, res) => {
  try {
    const { foodName, location, userId } = req.body;

    if (!foodName || !location) {
      return res
        .status(400)
        .json({ message: "Food name and location are required" });
    }

    console.log(`Checking suitability for ${foodName} in ${location}`);

    const FRONTEND_URL = process.env.FRONTEND_URL;
    // Get weather data for the location
    let weatherData;
    try {
      // const weatherResponse = await axios.get(
      //   `http://localhost:5000/api/weather?city=${encodeURIComponent(location)}`
      // );
      const weatherResponse = await axios.get(
        `https://climate-eats-cuyx.vercel.app/api/weather?city=${encodeURIComponent(location)}`
      );
      weatherData = weatherResponse.data;
      console.log("Weather data received:", weatherData);
    } catch (error) {
      console.error("Error fetching weather data:", error);
      return res
        .status(500)
        .json({ message: "Failed to fetch weather data for this location" });
    }

    // Get user's BMI category
    let userBmiCategory = "Normal"; // Default
    if (userId) {
      try {
        // Try to get from global users array first (for testing)
        const user = global.users?.find((u) => u._id.toString() === userId);
        if (user && user.bmiCategory) {
          userBmiCategory = user.bmiCategory;
        } else {
          // If not found in memory, try database
          const User = require("../models/User");
          const dbUser = await User.findById(userId);
          if (dbUser && dbUser.bmiCategory) {
            userBmiCategory = dbUser.bmiCategory;
          }
        }
      } catch (error) {
        console.error("Error fetching user BMI data:", error);
        // Continue with default BMI category
      }
    }

    console.log(`User BMI category: ${userBmiCategory}`);

    // Determine weather category
    const weatherCategory = getWeatherCategory(weatherData);
    console.log(`Weather category determined: ${weatherCategory}`);

    // Try to find the food in the database
    let food;
    try {
      food = await Food.findOne({
        name: { $regex: new RegExp(foodName, "i") },
      });
    } catch (error) {
      console.error("Error querying database:", error);
      // Continue to fallback
    }

    // If not found in database, check sample foods
    if (!food) {
      food = sampleFoods.find(
        (f) => f.name.toLowerCase() === foodName.toLowerCase()
      );
    }

    // If still not found, make a best guess based on the name
    if (!food) {
      console.log(
        "Food not found in database or sample list, making best guess"
      );
      return makeBestGuess(foodName, weatherCategory, userBmiCategory, res);
    }

    // Check if the food is suitable for the current weather
    const weatherSuitable = food.suitableWeather.some(
      (w) => w.toLowerCase() === weatherCategory.toLowerCase() || w === "Any"
    );

    // Check if the food is suitable for the user's BMI
    const bmiSuitable = food.suitableBmiCategories.some(
      (b) => b.toLowerCase() === userBmiCategory.toLowerCase() || b === "Any"
    );

    // Prepare response
    const suitable = weatherSuitable && bmiSuitable;
    let explanation = "";

    if (suitable) {
      explanation = `${food.name} is suitable for ${weatherCategory} weather and your ${userBmiCategory} BMI category. ${food.description}`;
    } else if (!weatherSuitable && bmiSuitable) {
      explanation = `${food.name} is not ideal for ${weatherCategory} weather, but it is suitable for your ${userBmiCategory} BMI category.`;
    } else if (weatherSuitable && !bmiSuitable) {
      explanation = `${food.name} is suitable for ${weatherCategory} weather, but it may not be ideal for your ${userBmiCategory} BMI category.`;
    } else {
      explanation = `${food.name} is not recommended for ${weatherCategory} weather and your ${userBmiCategory} BMI category.`;
    }

    return res.json({
      suitable,
      explanation,
      weatherCategory,
      bmiCategory: userBmiCategory,
      food: {
        name: food.name,
        calories: food.calories,
        description: food.description,
      },
    });
  } catch (error) {
    console.error("Error in checkFoodSuitability:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// Helper function to make a best guess for foods not in the database
const makeBestGuess = (foodName, weatherCategory, bmiCategory, res) => {
  const lowerFoodName = foodName.toLowerCase();
  let suitable = true;
  let explanation = "";
  let guessedCalories = 200; // Default medium calories

  // Cold weather foods
  const coldWeatherFoods = [
    "soup",
    "stew",
    "hot",
    "warm",
    "oatmeal",
    "porridge",
    "coffee",
    "tea",
    "chocolate",
    "curry",
  ];

  // Hot weather foods
  const hotWeatherFoods = [
    "salad",
    "ice",
    "cold",
    "cool",
    "smoothie",
    "fruit",
    "yogurt",
    "juice",
    "watermelon",
    "curd",
  ];

  // High calorie foods (not ideal for overweight/obese)
  const highCalorieFoods = [
    "cake",
    "pizza",
    "burger",
    "fries",
    "fried",
    "cheese",
    "cream",
    "chocolate",
    "dessert",
    "sweet",
    "pastry",
    "ice cream",
  ];

  // Low calorie foods (not ideal for underweight)
  const lowCalorieFoods = [
    "salad",
    "vegetable",
    "diet",
    "light",
    "low-fat",
    "low-calorie",
    "broth",
  ];

  // Check weather suitability
  let weatherSuitable = true;
  if (
    weatherCategory === "Cold" ||
    weatherCategory === "Rainy" ||
    weatherCategory === "Cloudy"
  ) {
    // Check if it's a hot weather food in cold weather
    if (hotWeatherFoods.some((food) => lowerFoodName.includes(food))) {
      weatherSuitable = false;
    }
  } else if (weatherCategory === "Hot" || weatherCategory === "Sunny") {
    // Check if it's a cold weather food in hot weather
    if (coldWeatherFoods.some((food) => lowerFoodName.includes(food))) {
      weatherSuitable = false;
    }
  }

  // Check BMI suitability
  let bmiSuitable = true;
  if (bmiCategory === "Overweight" || bmiCategory === "Obese") {
    // Check if it's a high calorie food for overweight/obese
    if (highCalorieFoods.some((food) => lowerFoodName.includes(food))) {
      bmiSuitable = false;
      guessedCalories = 350; // Assume high calories
    }
  } else if (bmiCategory === "Underweight") {
    // Check if it's a low calorie food for underweight
    if (lowCalorieFoods.some((food) => lowerFoodName.includes(food))) {
      bmiSuitable = false;
      guessedCalories = 100; // Assume low calories
    }
  }

  suitable = weatherSuitable && bmiSuitable;

  // Create explanation
  if (suitable) {
    explanation = `Based on our analysis, ${foodName} appears to be suitable for ${weatherCategory} weather and your ${bmiCategory} BMI category.`;
  } else if (!weatherSuitable && bmiSuitable) {
    explanation = `${foodName} may not be ideal for ${weatherCategory} weather, but it seems suitable for your ${bmiCategory} BMI category.`;
  } else if (weatherSuitable && !bmiSuitable) {
    explanation = `${foodName} seems suitable for ${weatherCategory} weather, but it may not be ideal for your ${bmiCategory} BMI category.`;
  } else {
    explanation = `${foodName} may not be recommended for ${weatherCategory} weather and your ${bmiCategory} BMI category.`;
  }

  return res.json({
    suitable,
    explanation,
    weatherCategory,
    bmiCategory,
    food: {
      name: foodName,
      calories: guessedCalories,
      description: "No detailed information available for this food.",
    },
    note: "This is a best guess as this food is not in our database.",
  });
};

// Helper function to map weather conditions to categories
const getWeatherCategory = (weatherData) => {
  if (!weatherData) return "Any";

  // If category is already provided
  if (weatherData.category) return weatherData.category;

  // Try to determine category from conditions
  const condition = weatherData.weatherCondition?.toLowerCase() || "";
  const temp =
    typeof weatherData.temperature === "object"
      ? weatherData.temperature.current
      : weatherData.temperature;

  if (
    condition.includes("rain") ||
    condition.includes("drizzle") ||
    condition.includes("shower")
  ) {
    return "Rainy";
  } else if (
    condition.includes("snow") ||
    condition.includes("sleet") ||
    condition.includes("blizzard")
  ) {
    return "Cold";
  } else if (
    condition.includes("cloud") ||
    condition.includes("overcast") ||
    condition.includes("fog")
  ) {
    return "Cloudy";
  } else if (condition.includes("clear") || condition.includes("sun")) {
    // Check temperature to decide between hot and normal sunny
    if (temp && temp > 25) {
      return "Hot";
    } else {
      return "Sunny";
    }
  } else if (temp) {
    // Fallback to temperature
    if (temp < 15) return "Cold";
    if (temp > 28) return "Hot";
    return "Sunny";
  }

  return "Any";
};

// @desc    Get food recommendations based on location
// @route   GET /api/foods/recommend
// @access  Private
const getRecommendedFoods = async (req, res) => {
  try {
    const { location } = req.query;

    if (!location) {
      return res.status(400).json({ message: "Location is required" });
    }

    console.log(`Getting food recommendations for ${location}`);

    // Try to get foods from database
    let foods = [];
    try {
      foods = await Food.find({}).lean();
    } catch (error) {
      console.error("Error querying database:", error);
      // Continue with sample foods
    }

    // If no foods in database, use sample foods
    if (!foods || foods.length === 0) {
      foods = sampleFoods;
    }

    // Map the foods to the expected format
    const mappedFoods = foods.map((food) => ({
      name: food.name,
      calorieLevel: getCaloricLevel(food.calories),
      weatherType:
        Array.isArray(food.suitableWeather) && food.suitableWeather.length > 0
          ? food.suitableWeather[0]
          : "Any",
      bmiCategory:
        Array.isArray(food.suitableBmiCategories) &&
        food.suitableBmiCategories.length > 0
          ? food.suitableBmiCategories[0]
          : "Any",
      description: food.description || "No description available",
    }));

    return res.json(mappedFoods);
  } catch (error) {
    console.error("Error in getRecommendedFoods:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// Helper function to determine calorie level based on calorie count
const getCaloricLevel = (calories) => {
  if (!calories) return "Medium";
  if (calories < 150) return "Low";
  if (calories > 300) return "High";
  return "Medium";
};

// @desc    Get common foods
// @route   GET /api/foods/common
// @access  Public
const getCommonFoods = async (req, res) => {
  try {
    // Try to get foods from database
    let foods = [];
    try {
      foods = await Food.find({}).lean();
    } catch (error) {
      console.error("Error querying database for common foods:", error);
      // Continue with sample foods
    }

    // If no foods in database, return sample foods
    if (!foods || foods.length === 0) {
      return res.json(sampleFoods);
    }

    return res.json(foods);
  } catch (error) {
    console.error("Error fetching common foods:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// @desc    Add a new food
// @route   POST /api/foods
// @access  Admin
const addFood = async (req, res) => {
  try {
    const {
      name,
      calories,
      suitableWeather,
      suitableBmiCategories,
      description,
    } = req.body;

    if (!name || !calories) {
      return res
        .status(400)
        .json({ message: "Name and calories are required" });
    }

    // Check if food already exists
    const existingFood = await Food.findOne({
      name: { $regex: new RegExp(`^${name}$`, "i") },
    });
    if (existingFood) {
      return res.status(400).json({ message: "Food already exists" });
    }

    const newFood = new Food({
      name,
      calories,
      suitableWeather: suitableWeather || ["Any"],
      suitableBmiCategories: suitableBmiCategories || ["Any"],
      description: description || `${name} - no description provided.`,
    });

    const savedFood = await newFood.save();
    return res.status(201).json(savedFood);
  } catch (error) {
    console.error("Error adding food:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  checkFoodSuitability,
  getRecommendedFoods,
  getCommonFoods,
  addFood,
};
