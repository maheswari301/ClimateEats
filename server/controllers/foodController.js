const Food = require("../models/Food");
const axios = require("axios");

// Sample food data for testing (when MongoDB is not available)
const sampleFoods = [
  {
    _id: "1",
    name: "Idiyappam + Coconut Milk",
    calories: 300,
    suitableWeather: ["Hot", "Sunny"],
    suitableBmiCategories: ["Any"],
    description: "Soft string hoppers served with sweet coconut milk.",
  },
  {
    _id: "2",
    name: "Curd Rice + Pomegranate",
    calories: 220,
    suitableWeather: ["Hot"],
    suitableBmiCategories: ["Any"],
    description: "Cooling curd rice topped with fresh pomegranate seeds.",
  },
  {
    _id: "3",
    name: "Dosa + Coconut Chutney",
    calories: 250,
    suitableWeather: ["Any"],
    suitableBmiCategories: ["Normal"],
    description: "Crispy dosa served with fresh coconut chutney.",
  },
  {
    _id: "4",
    name: "Ven Pongal + Coconut Chutney",
    calories: 320,
    suitableWeather: ["Any"],
    suitableBmiCategories: ["Any"],
    description: "Comforting rice-lentil dish with coconut chutney.",
  },
  {
    _id: "5",
    name: "Rava Upma + Pickle",
    calories: 280,
    suitableWeather: ["Any"],
    suitableBmiCategories: ["Any"],
    description: "Semolina-based savory breakfast with tangy pickle.",
  },
  {
    _id: "6",
    name: "Tomato Bath + Curd",
    calories: 300,
    suitableWeather: ["Hot"],
    suitableBmiCategories: ["Any"],
    description: "Spicy tomato rice paired with cooling curd.",
  },
  {
    _id: "7",
    name: "Murukku + Butter Milk",
    calories: 400,
    suitableWeather: ["Hot"],
    suitableBmiCategories: ["Underweight"],
    description: "Crunchy snack with refreshing buttermilk.",
  },
  {
    _id: "8",
    name: "Vada + Sambar",
    calories: 350,
    suitableWeather: ["Rainy", "Cold"],
    suitableBmiCategories: ["Any"],
    description: "Fried lentil donuts served with hot sambar.",
  },
  {
    _id: "9",
    name: "Parotta + Salna",
    calories: 450,
    suitableWeather: ["Any"],
    suitableBmiCategories: ["Underweight"],
    description: "Flaky flatbread with spicy gravy.",
  },
  {
    _id: "10",
    name: "Pongal + Ghee",
    calories: 350,
    suitableWeather: ["Cold"],
    suitableBmiCategories: ["Any"],
    description: "Creamy rice dish enriched with ghee.",
  },
  {
    _id: "11",
    name: "Vegetable Kurma + Idiyappam",
    calories: 300,
    suitableWeather: ["Any"],
    suitableBmiCategories: ["Any"],
    description: "String hoppers served with mild vegetable curry.",
  },
  {
    _id: "12",
    name: "Kesari + Upma",
    calories: 320,
    suitableWeather: ["Any"],
    suitableBmiCategories: ["Any"],
    description: "Sweet and savory semolina duo.",
  },
  {
    _id: "13",
    name: "Pesarattu + Ginger Chutney",
    calories: 280,
    suitableWeather: ["Any"],
    suitableBmiCategories: ["Any"],
    description: "Moong dal dosa with spicy chutney.",
  },
  {
    _id: "14",
    name: "Idli + Sambar",
    calories: 200,
    suitableWeather: ["Any"],
    suitableBmiCategories: ["Overweight", "Obese"],
    description: "Steamed rice cakes served with lentil soup.",
  },
  {
    _id: "15",
    name: "Appam + Stew",
    calories: 330,
    suitableWeather: ["Any"],
    suitableBmiCategories: ["Any"],
    description: "Soft pancakes with coconut milk vegetable stew.",
  },
  {
    _id: "16",
    name: "Ragi Dosa + Onion Chutney",
    calories: 220,
    suitableWeather: ["Any"],
    suitableBmiCategories: ["Overweight", "Obese"],
    description: "Healthy millet crepe with tangy onion chutney.",
  },
  {
    _id: "17",
    name: "Tamarind Rice + Fryums",
    calories: 300,
    suitableWeather: ["Hot"],
    suitableBmiCategories: ["Any"],
    description: "Tangy rice with crunchy side snack.",
  },
  {
    _id: "18",
    name: "Adai + Avial",
    calories: 350,
    suitableWeather: ["Any"],
    suitableBmiCategories: ["Any"],
    description: "Lentil pancake paired with mixed vegetable curry.",
  },
  {
    _id: "19",
    name: "Kootu + Chapati",
    calories: 300,
    suitableWeather: ["Any"],
    suitableBmiCategories: ["Any"],
    description: "Mild spiced dal-vegetable mix with flatbread.",
  },
  {
    _id: "20",
    name: "Poori + Potato Masala",
    calories: 400,
    suitableWeather: ["Any"],
    suitableBmiCategories: ["Underweight"],
    description: "Puffed bread with spiced mashed potatoes.",
  },
  {
    _id: "21",
    name: "Masala Dosa + Mint Chutney",
    calories: 350,
    suitableWeather: ["Any"],
    suitableBmiCategories: ["Any"],
    description: "Stuffed crispy dosa with fresh mint chutney.",
  },
  {
    _id: "22",
    name: "Lemon Rice + Papad",
    calories: 280,
    suitableWeather: ["Hot"],
    suitableBmiCategories: ["Any"],
    description: "Zesty rice with crunchy accompaniment.",
  },
  {
    _id: "23",
    name: "Rasam + Rice + Potato Fry",
    calories: 300,
    suitableWeather: ["Rainy"],
    suitableBmiCategories: ["Any"],
    description: "Comfort meal of soup, rice, and crispy potatoes.",
  },
  {
    _id: "24",
    name: "Semiya Upma + Chutney",
    calories: 260,
    suitableWeather: ["Any"],
    suitableBmiCategories: ["Any"],
    description: "Vermicelli breakfast dish with chutney.",
  },
  {
    _id: "25",
    name: "Uttapam + Tomato Chutney",
    calories: 280,
    suitableWeather: ["Any"],
    suitableBmiCategories: ["Any"],
    description: "Thick dosa with toppings and tangy chutney.",
  },
  {
    _id: "26",
    name: "Sundal + Tea",
    calories: 200,
    suitableWeather: ["Any"],
    suitableBmiCategories: ["Any"],
    description: "Protein-rich legume snack with hot tea.",
  },
  {
    _id: "27",
    name: "Vegetable Biryani + Raita",
    calories: 350,
    suitableWeather: ["Any"],
    suitableBmiCategories: ["Any"],
    description: "Spiced rice with cooling yogurt mix.",
  },
  {
    _id: "28",
    name: "Rice + Sambar + Poriyal",
    calories: 320,
    suitableWeather: ["Any"],
    suitableBmiCategories: ["Any"],
    description: "Balanced South Indian meal combo.",
  },
  {
    _id: "29",
    name: "Chapati + Vegetable Kurma",
    calories: 300,
    suitableWeather: ["Any"],
    suitableBmiCategories: ["Any"],
    description: "Whole wheat flatbread with rich veggie curry.",
  },
  {
    _id: "30",
    name: "Bisi Bele Bath + Boondi",
    calories: 350,
    suitableWeather: ["Cold", "Rainy"],
    suitableBmiCategories: ["Any"],
    description: "Spicy rice-lentil mix with crispy boondi topping.",
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
