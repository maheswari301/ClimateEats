/**
 * Add common foods for testing
 */

const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Food = require("../models/Food");

// Load environment variables
dotenv.config();

// Common foods
// Common foods
const commonFoods = [
  {
    name: "Sandwich",
    calories: 350,
    suitableWeather: ["Any"],
    suitableBmiCategories: ["Any"],
    description: "A versatile meal that works in any weather",
  },
  {
    name: "Rice",
    calories: 200,
    suitableWeather: ["Any"],
    suitableBmiCategories: ["Any"],
    description: "A staple food that pairs well with many dishes",
  },
  {
    name: "Ice Cream",
    calories: 300,
    suitableWeather: ["Hot", "Sunny"],
    suitableBmiCategories: ["Underweight", "Normal"],
    description: "A cooling treat for hot days",
  },
  {
    name: "Soup",
    calories: 250,
    suitableWeather: ["Cold", "Rainy", "Cloudy"],
    suitableBmiCategories: ["Any"],
    description: "Comforting and warming for cold days",
  },
  {
    name: "Apple",
    calories: 95,
    suitableWeather: ["Any"],
    suitableBmiCategories: ["Overweight", "Obese"],
    description: "A healthy snack low in calories",
  },
  {
    name: "Biryani",
    calories: 400,
    suitableWeather: ["Any"],
    suitableBmiCategories: ["Underweight", "Normal"],
    description: "A flavorful rice dish rich in spices and calories",
  },
  {
    name: "Salad",
    calories: 150,
    suitableWeather: ["Hot", "Sunny"],
    suitableBmiCategories: ["Overweight", "Obese", "Normal"],
    description: "A light and refreshing dish perfect for hot weather",
  },
  {
    name: "Grilled Chicken",
    calories: 250,
    suitableWeather: ["Any"],
    suitableBmiCategories: ["Normal", "Underweight"],
    description: "A protein-rich meal suitable for fitness goals",
  },
  {
    name: "Hot Chocolate",
    calories: 190,
    suitableWeather: ["Cold", "Rainy", "Cloudy"],
    suitableBmiCategories: ["Underweight"],
    description: "A warm, sweet drink perfect for chilly weather",
  },
  {
    name: "Smoothie",
    calories: 180,
    suitableWeather: ["Hot", "Sunny"],
    suitableBmiCategories: ["Any"],
    description: "A refreshing fruity drink to cool down",
  },
  {
    name: "Oatmeal",
    calories: 220,
    suitableWeather: ["Cold", "Rainy"],
    suitableBmiCategories: ["Overweight", "Obese", "Normal"],
    description: "A healthy breakfast rich in fiber",
  },
  {
    name: "Fried Rice",
    calories: 370,
    suitableWeather: ["Any"],
    suitableBmiCategories: ["Underweight", "Normal"],
    description: "A tasty, satisfying dish for any weather",
  },
  {
    name: "Paneer Tikka",
    calories: 280,
    suitableWeather: ["Any"],
    suitableBmiCategories: ["Normal"],
    description: "A protein-rich vegetarian delight",
  },
  {
    name: "Rasam",
    calories: 100,
    suitableWeather: ["Rainy", "Cold"],
    suitableBmiCategories: ["Any"],
    description: "A spicy South Indian soup perfect for rainy days",
  },
  {
    name: "Watermelon",
    calories: 85,
    suitableWeather: ["Hot", "Sunny"],
    suitableBmiCategories: ["Any"],
    description: "A juicy fruit to keep you hydrated in summer",
  },
  {
    name: "Idli",
    calories: 150,
    suitableWeather: ["Any"],
    suitableBmiCategories: ["Overweight", "Normal"],
    description: "Soft steamed rice cakes, light and healthy breakfast.",
  },
  {
    name: "Dosa",
    calories: 180,
    suitableWeather: ["Any"],
    suitableBmiCategories: ["Normal", "Underweight"],
    description: "Crispy rice crepe, a South Indian staple.",
  },
  {
    name: "Vada",
    calories: 250,
    suitableWeather: ["Rainy", "Cloudy"],
    suitableBmiCategories: ["Underweight"],
    description: "Crispy fried savory doughnuts, perfect with chutney.",
  },
  {
    name: "Upma",
    calories: 200,
    suitableWeather: ["Any"],
    suitableBmiCategories: ["Normal", "Overweight"],
    description: "Healthy semolina dish for a light meal.",
  },
  {
    name: "Pongal",
    calories: 280,
    suitableWeather: ["Rainy", "Cold"],
    suitableBmiCategories: ["Normal"],
    description: "Traditional South Indian rice-lentil dish, very filling.",
  },
  {
    name: "Curd Rice",
    calories: 180,
    suitableWeather: ["Hot", "Sunny"],
    suitableBmiCategories: ["Any"],
    description: "Cooling and soothing dish for hot weather.",
  },
  {
    name: "Sambar",
    calories: 150,
    suitableWeather: ["Any"],
    suitableBmiCategories: ["Any"],
    description: "Spicy lentil-based vegetable stew rich in protein.",
  },
  {
    name: "Rasam",
    calories: 90,
    suitableWeather: ["Rainy", "Cold"],
    suitableBmiCategories: ["Any"],
    description: "Spicy, tangy soup, good for digestion and immunity.",
  },
  {
    name: "Parotta",
    calories: 330,
    suitableWeather: ["Any"],
    suitableBmiCategories: ["Underweight"],
    description: "Flaky layered flatbread loved across Tamil Nadu.",
  },
  {
    name: "Kothu Parotta",
    calories: 450,
    suitableWeather: ["Any"],
    suitableBmiCategories: ["Underweight"],
    description: "Chopped parotta mixed with spicy masala, high calorie.",
  },
  {
    name: "Paniyaram",
    calories: 210,
    suitableWeather: ["Cloudy", "Rainy"],
    suitableBmiCategories: ["Normal"],
    description: "Soft dumplings made from idli/dosa batter.",
  },
  {
    name: "Sundal",
    calories: 160,
    suitableWeather: ["Sunny", "Cloudy"],
    suitableBmiCategories: ["Overweight", "Normal"],
    description: "Boiled chickpeas tempered with coconut, healthy snack.",
  },
  {
    name: "Murukku",
    calories: 250,
    suitableWeather: ["Cloudy", "Rainy"],
    suitableBmiCategories: ["Underweight"],
    description: "Crunchy spiral snack made from rice flour.",
  },
  {
    name: "Adai",
    calories: 300,
    suitableWeather: ["Any"],
    suitableBmiCategories: ["Normal"],
    description: "Protein-rich thick dosa made with mixed lentils.",
  },
  {
    name: "Thayir Vadai",
    calories: 280,
    suitableWeather: ["Hot", "Cloudy"],
    suitableBmiCategories: ["Normal", "Overweight"],
    description: "Vadai soaked in yogurt, very refreshing.",
  },
  {
    name: "Kesari",
    calories: 250,
    suitableWeather: ["Any"],
    suitableBmiCategories: ["Underweight"],
    description: "Sweet semolina dessert flavored with saffron and ghee.",
  },
  {
    name: "Puliyodarai (Tamarind Rice)",
    calories: 300,
    suitableWeather: ["Any"],
    suitableBmiCategories: ["Normal"],
    description: "Tangy and spicy rice variety popular across Tamil Nadu.",
  },
  {
    name: "Lemon Rice",
    calories: 280,
    suitableWeather: ["Hot", "Sunny"],
    suitableBmiCategories: ["Any"],
    description: "Refreshing rice dish infused with lemon and mustard seeds.",
  },
  {
    name: "Kuzhi Paniyaram",
    calories: 230,
    suitableWeather: ["Cloudy", "Rainy"],
    suitableBmiCategories: ["Normal"],
    description: "Small round dumplings made with fermented batter.",
  },
  {
    name: "Medhu Vadai",
    calories: 220,
    suitableWeather: ["Rainy", "Cloudy"],
    suitableBmiCategories: ["Underweight"],
    description: "Soft inside, crispy outside lentil fritters.",
  },
  {
    name: "Grilled Chicken",
    calories: 300,
    suitableWeather: ["Any"],
    suitableBmiCategories: ["Normal", "Underweight"],
    description: "High-protein, low-fat meat good for muscle building.",
  },
  {
    name: "Smoothie",
    calories: 180,
    suitableWeather: ["Hot", "Sunny"],
    suitableBmiCategories: ["Any"],
    description: "A refreshing drink packed with fruits and nutrients.",
  },
  {
    name: "Oatmeal",
    calories: 220,
    suitableWeather: ["Cold", "Cloudy", "Rainy"],
    suitableBmiCategories: ["Overweight", "Normal"],
    description: "A warm and healthy breakfast perfect for chilly mornings.",
  },
  {
    name: "Paneer Tikka",
    calories: 320,
    suitableWeather: ["Any"],
    suitableBmiCategories: ["Underweight", "Normal"],
    description: "A protein-rich Indian snack, perfect for all weather.",
  },
  {
    name: "Vegetable Stir Fry",
    calories: 200,
    suitableWeather: ["Hot", "Cloudy"],
    suitableBmiCategories: ["Overweight", "Obese"],
    description: "Light and fiber-rich dish great for weight management.",
  },
  {
    name: "Hot Samosa",
    calories: 270,
    suitableWeather: ["Cold", "Rainy"],
    suitableBmiCategories: ["Underweight"],
    description: "Crispy and spicy snack perfect for rainy and cold days.",
  },
  {
    name: "Popsicle",
    calories: 90,
    suitableWeather: ["Hot", "Sunny"],
    suitableBmiCategories: ["Any"],
    description: "A frozen treat to beat the summer heat.",
  },
  {
    name: "Khichdi",
    calories: 250,
    suitableWeather: ["Rainy", "Cloudy"],
    suitableBmiCategories: ["Overweight", "Normal"],
    description: "Comfort food rich in nutrients and easy to digest.",
  },
  {
    name: "Protein Bar",
    calories: 210,
    suitableWeather: ["Any"],
    suitableBmiCategories: ["Underweight", "Normal"],
    description: "Quick energy snack for active individuals.",
  },
  {
    name: "Dal Tadka",
    calories: 270,
    suitableWeather: ["Any"],
    suitableBmiCategories: ["Any"],
    description: "High-protein lentil curry ideal for daily meals.",
  },
  {
    name: "Mango Juice",
    calories: 150,
    suitableWeather: ["Hot", "Sunny"],
    suitableBmiCategories: ["Underweight", "Normal"],
    description: "A tropical drink best enjoyed during summer.",
  },
  {
    name: "Steamed Momos",
    calories: 200,
    suitableWeather: ["Cold", "Rainy"],
    suitableBmiCategories: ["Normal", "Overweight"],
    description: "Light and tasty dumplings perfect for chilly weather.",
  },
  {
    name: "Boiled Corn",
    calories: 140,
    suitableWeather: ["Rainy", "Cloudy"],
    suitableBmiCategories: ["Any"],
    description: "Healthy street snack ideal for rainy evenings.",
  },
  {
    name: "Avocado Toast",
    calories: 260,
    suitableWeather: ["Sunny", "Cloudy"],
    suitableBmiCategories: ["Normal", "Overweight"],
    description: "Healthy breakfast rich in good fats and fiber.",
  },
  {
    name: "Green Tea",
    calories: 5,
    suitableWeather: ["Cold", "Rainy"],
    suitableBmiCategories: ["Overweight", "Obese"],
    description: "Low-calorie beverage boosting metabolism and warmth.",
  },
];

// MongoDB connection
const mongoUri = process.env.MONGO_URI

console.log("Connecting to MongoDB...");

// Create and save the food items
async function addCommonFoods() {
  try {
    // Connect to MongoDB
    await mongoose.connect(mongoUri);
    console.log("Connected to MongoDB");

    // Add each food
    for (const foodData of commonFoods) {
      // Check if food already exists
      const existing = await Food.findOne({ name: foodData.name });
      if (existing) {
        console.log(`Food "${foodData.name}" already exists, skipping`);
        continue;
      }

      // Create the food item
      const food = await Food.create(foodData);
      console.log(`Added: ${food.name}`);
    }

    // Get all foods to verify
    const allFoods = await Food.find().select("name");
    console.log("\nAll foods in database:");
    allFoods.forEach((f) => console.log(`- ${f.name}`));

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
addCommonFoods();
