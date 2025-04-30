import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/FoodEntry.css";

// Configure axios with the backend URL
const API_BASE_URL = "http://localhost:5000"; // Your actual backend URL

// Fallback food data as a last resort if API and database both fail
const fallbackFoods = [
  {
    name: "Sandwich",
    calorieLevel: "Medium",
    weatherType: "Any",
    bmiCategory: "Any",
    description: "A versatile meal that works in any weather",
  },
  {
    name: "Rice",
    calorieLevel: "Medium",
    weatherType: "Any",
    bmiCategory: "Any",
    description: "A staple food that pairs well with many dishes",
  },
  {
    name: "Ice Cream",
    calorieLevel: "High",
    weatherType: "Hot",
    bmiCategory: "Underweight",
    description: "A cooling treat for hot days",
  },
  {
    name: "Soup",
    calorieLevel: "Medium",
    weatherType: "Cold",
    bmiCategory: "Any",
    description: "Comforting and warming for cold days",
  },
  {
    name: "Salad",
    calorieLevel: "Low",
    weatherType: "Hot",
    bmiCategory: "Overweight",
    description: "A light and refreshing dish perfect for hot weather",
  },
  {
    name: "Curd Rice",
    calorieLevel: "Medium",
    weatherType: "Hot",
    bmiCategory: "Any",
    description: "Cooling and soothing dish for hot weather.",
  },
  {
    name: "Idli",
    calorieLevel: "Low",
    weatherType: "Any",
    bmiCategory: "Overweight",
    description: "Soft steamed rice cakes, light and healthy breakfast.",
  },
  {
    name: "Dosa",
    calorieLevel: "Medium",
    weatherType: "Any",
    bmiCategory: "Normal",
    description: "Crispy rice crepe, a South Indian staple.",
  },
  {
    name: "Vada",
    calorieLevel: "Medium",
    weatherType: "Rainy",
    bmiCategory: "Underweight",
    description: "Crispy fried savory doughnuts, perfect with chutney.",
  },
  {
    name: "Upma",
    calorieLevel: "Medium",
    weatherType: "Any",
    bmiCategory: "Normal",
    description: "Healthy semolina dish for a light meal.",
  },
  {
    name: "Pongal",
    calorieLevel: "Medium",
    weatherType: "Cold",
    bmiCategory: "Normal",
    description: "Traditional South Indian rice-lentil dish, very filling.",
  },
  {
    name: "Sambar",
    calorieLevel: "Low",
    weatherType: "Any",
    bmiCategory: "Any",
    description: "Spicy lentil-based vegetable stew rich in protein.",
  },
  {
    name: "Rasam",
    calorieLevel: "Low",
    weatherType: "Rainy",
    bmiCategory: "Any",
    description: "Spicy, tangy soup, good for digestion and immunity.",
  },
  {
    name: "Hot Chocolate",
    calorieLevel: "Medium",
    weatherType: "Cold",
    bmiCategory: "Underweight",
    description: "A warm, sweet drink perfect for chilly weather",
  },
  {
    name: "Smoothie",
    calorieLevel: "Medium",
    weatherType: "Hot",
    bmiCategory: "Any",
    description: "A refreshing fruity drink to cool down",
  },
  {
    name: "Watermelon",
    calorieLevel: "Low",
    weatherType: "Hot",
    bmiCategory: "Any",
    description: "A juicy fruit to keep you hydrated in summer",
  },
  {
    name: "Oatmeal",
    calorieLevel: "Medium",
    weatherType: "Cold",
    bmiCategory: "Overweight",
    description: "A healthy breakfast rich in fiber",
  },
];

const FoodEntry = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("enter");
  const [formData, setFormData] = useState({
    foodName: "",
    location: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [foodItem, setFoodItem] = useState("");
  const [result, setResult] = useState(null);
  const [user, setUser] = useState(null);
  const [checkTabRecommendations, setCheckTabRecommendations] = useState([]);
  const [recommendationsError, setRecommendationsError] = useState(null);
  const [commonFoods, setCommonFoods] = useState([]); // New state for storing foods from backend

  // Add a reference for scrolling to results
  const resultsRef = useRef(null);

  useEffect(() => {
    // Check if user is logged in
    const userId = localStorage.getItem("userId");
    const userName = localStorage.getItem("userName");
    const userEmail = localStorage.getItem("userEmail");
    const bmi = localStorage.getItem("bmi");
    const bmiCategory = localStorage.getItem("bmiCategory");

    if (userId && userName) {
      setUser({
        _id: userId,
        name: userName,
        email: userEmail,
        bmi: bmi,
        bmiCategory: bmiCategory,
      });
    } else {
      navigate("/login");
    }

    // Fetch common foods from backend when component mounts
    fetchCommonFoodsFromBackend();
  }, [navigate]);

  // New function to fetch common foods from backend
  const fetchCommonFoodsFromBackend = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/foods/common`);
      console.log("Common foods fetched from backend:", response.data);

      if (Array.isArray(response.data) && response.data.length > 0) {
        // Map the backend food structure to match our frontend structure if needed
        const mappedFoods = response.data.map((food) => ({
          name: food.name,
          calorieLevel: getCaloricLevel(food.calories),
          weatherType:
            Array.isArray(food.suitableWeather) &&
            food.suitableWeather.length > 0
              ? food.suitableWeather[0]
              : food.weatherType || "Any",
          bmiCategory:
            Array.isArray(food.suitableBmiCategories) &&
            food.suitableBmiCategories.length > 0
              ? food.suitableBmiCategories[0]
              : food.bmiCategory || "Any",
          description: food.description || "No description available",
        }));

        setCommonFoods(mappedFoods);
      }
    } catch (error) {
      console.error("Error fetching common foods from backend:", error);
      // If we can't fetch foods, we'll use the fallback foods
    }
  };

  // Helper function to determine calorie level based on calorie count
  const getCaloricLevel = (calories) => {
    if (!calories) return "Medium";
    if (calories < 150) return "Low";
    if (calories > 300) return "High";
    return "Medium";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleLogout = () => {
    // Clear all localStorage items
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("bmi");
    localStorage.removeItem("bmiCategory");
    navigate("/login");
  };

  const fetchRecommendedFoods = async (location) => {
    try {
      // Encode the location parameter to handle special characters
      const encodedLocation = encodeURIComponent(location);
      const response = await axios.get(
        `${API_BASE_URL}/api/foods/recommend?location=${encodedLocation}`
      );
      console.log("Recommendations response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching recommendations:", error);

      // Use common foods from backend or fallback to hardcoded list
      console.log("Using common foods from database");
      setRecommendationsError(
        "API unavailable. Showing common foods from database."
      );

      // Return common foods from backend if available, otherwise use fallback
      return commonFoods.length > 0 ? commonFoods : fallbackFoods;
    }
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

  // Function to get food recommendations based on weather and BMI
  const getFilteredRecommendations = (
    allFoods,
    weatherCategory,
    bmiCategory
  ) => {
    console.log(
      `Filtering foods - Weather: ${weatherCategory}, BMI: ${bmiCategory}`
    );

    if (!allFoods || !allFoods.length) {
      return commonFoods.length > 0 ? commonFoods : fallbackFoods;
    }

    // First try to find exact matches for both weather and BMI
    const exactMatches = allFoods.filter(
      (food) =>
        (food.weatherType.toLowerCase() === weatherCategory.toLowerCase() ||
          food.weatherType === "Any") &&
        (food.bmiCategory.toLowerCase() === bmiCategory.toLowerCase() ||
          food.bmiCategory === "Any")
    );

    console.log("Exact matches for both weather and BMI:", exactMatches.length);

    if (exactMatches.length >= 3) {
      return exactMatches;
    }

    // Otherwise look for foods matching at least the weather
    const weatherMatches = allFoods.filter(
      (food) =>
        food.weatherType.toLowerCase() === weatherCategory.toLowerCase() ||
        food.weatherType === "Any"
    );

    console.log("Weather matches:", weatherMatches.length);

    if (weatherMatches.length >= 3) {
      return weatherMatches;
    }

    // If we still don't have enough, include all and prioritize
    const prioritized = [...allFoods].sort((a, b) => {
      const aWeatherMatch =
        a.weatherType.toLowerCase() === weatherCategory.toLowerCase() ||
        a.weatherType === "Any";
      const bWeatherMatch =
        b.weatherType.toLowerCase() === weatherCategory.toLowerCase() ||
        b.weatherType === "Any";
      const aBmiMatch =
        a.bmiCategory.toLowerCase() === bmiCategory.toLowerCase() ||
        a.bmiCategory === "Any";
      const bBmiMatch =
        b.bmiCategory.toLowerCase() === bmiCategory.toLowerCase() ||
        b.bmiCategory === "Any";

      // Both match both criteria
      if (aWeatherMatch && aBmiMatch && bWeatherMatch && bBmiMatch) return 0;
      // A matches both, B doesn't
      if (aWeatherMatch && aBmiMatch) return -1;
      // B matches both, A doesn't
      if (bWeatherMatch && bBmiMatch) return 1;
      // A matches weather, B doesn't
      if (aWeatherMatch && !bWeatherMatch) return -1;
      // B matches weather, A doesn't
      if (bWeatherMatch && !aWeatherMatch) return 1;
      // A matches BMI, B doesn't
      if (aBmiMatch && !bBmiMatch) return -1;
      // B matches BMI, A doesn't
      if (bBmiMatch && !aBmiMatch) return 1;

      return 0;
    });

    console.log("Prioritized foods:", prioritized.length);
    return prioritized;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    setWeatherData(null);
    setResult(null);
    setFoodItem(formData.foodName);
    setRecommendationsError(null);
    setCheckTabRecommendations([]);

    try {
      // Fetch weather data first
      console.log("Fetching weather for:", formData.location);
      const weatherResponse = await axios.get(
        `${API_BASE_URL}/api/weather?city=${encodeURIComponent(
          formData.location
        )}`
      );
      const newWeatherData = weatherResponse.data;
      console.log("Weather data received:", newWeatherData);

      // Ensure location is set
      if (!newWeatherData.location) {
        newWeatherData.location = formData.location;
      }

      // Ensure category is set
      if (!newWeatherData.category) {
        newWeatherData.category = getWeatherCategory(newWeatherData);
        console.log("Weather category determined:", newWeatherData.category);
      }

      setWeatherData(newWeatherData);

      // Check food suitability
      const foodResponse = await axios.post(`${API_BASE_URL}/api/foods/check`, {
        foodName: formData.foodName,
        location: formData.location,
        userId: localStorage.getItem("userId"),
      });
      setResult(foodResponse.data);

      // Get user's BMI category
      const userBmiCategory = user?.bmiCategory || "Normal";

      // Fetch recommendations - this will now use common foods or fallback data if API fails
      let recommendations = [];
      try {
        recommendations = await fetchRecommendedFoods(formData.location);
      } catch (recError) {
        console.error("Failed to fetch recommendations:", recError);
      }

      // Determine which food source to use
      let foodsToUse = recommendations;
      if (!Array.isArray(recommendations) || recommendations.length === 0) {
        foodsToUse = commonFoods.length > 0 ? commonFoods : fallbackFoods;
        console.log("Using common foods or fallbacks:", foodsToUse.length);
      }

      // Filter the foods based on weather and BMI
      const filteredRecs = getFilteredRecommendations(
        foodsToUse,
        newWeatherData.category,
        userBmiCategory
      );

      setCheckTabRecommendations(filteredRecs);
      console.log("Final recommendations set:", filteredRecs.length);

      // After successful response, set the active tab
      setActiveTab("check");

      // Scroll to results after a short delay to ensure DOM updates and rendering completes
      setTimeout(() => {
        if (resultsRef.current) {
          resultsRef.current.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        } else {
          window.scrollTo({
            top: 0,
            behavior: "smooth",
          });
        }
      }, 300);
    } catch (err) {
      console.error("Error checking food suitability:", err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "An error occurred while checking food suitability"
      );
    } finally {
      setLoading(false);
    }
  };

  // Helper function to safely display temperature
  const renderTemperature = (temp) => {
    if (temp === undefined || temp === null) return "N/A";
    if (typeof temp === "object" && temp.current !== undefined) {
      return `${temp.current}°C`;
    }
    return `${temp}°C`;
  };

  return (
    <div className="food-page-wrapper">
      <div className="food-entry-container">
        <div className="header">
          <h2>Food Suitability</h2>
          <div className="user-info">
            {user && (
              <>
                <p className="user-name">
                  Welcome, <span className="highlight">{user.name}</span>
                </p>
                <button onClick={handleLogout} className="logout-btn">
                  Logout
                </button>
              </>
            )}
          </div>
        </div>

        <div className="tabs">
          <button
            className={`tab-btn ${activeTab === "enter" ? "active" : ""}`}
            onClick={() => setActiveTab("enter")}
          >
            Enter Food
          </button>
          <button
            className={`tab-btn ${activeTab === "check" ? "active" : ""}`}
            onClick={() => setActiveTab("check")}
            disabled={!result && !weatherData}
          >
            Check Suitability
          </button>
        </div>

        <div className="tab-content">
          {activeTab === "enter" && (
            <div className="food-entry-card">
              <p className="card-description">
                {user
                  ? `${user.name}, enter food and your location to check if it's suitable for the current weather and your BMI`
                  : "Enter food and your location to check if it's suitable for the current weather and your BMI"}
              </p>

              {error && <div className="error-message">{error}</div>}

              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="foodName" className="form-label">
                    Food Name
                  </label>
                  <input
                    type="text"
                    id="foodName"
                    name="foodName"
                    value={formData.foodName}
                    onChange={handleChange}
                    placeholder="Enter food name (e.g., Salad, Soup, Ice Cream)"
                    required
                    className="form-input"
                    aria-describedby="foodNameHelp"
                  />
                  <small id="foodNameHelp" className="form-text">
                    Enter a food to check its suitability
                  </small>
                </div>

                <div className="form-group">
                  <label htmlFor="location" className="form-label">
                    City
                  </label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="Enter your city (e.g., London, New York)"
                    required
                    className="form-input"
                    aria-describedby="locationHelp"
                  />
                  <small id="locationHelp" className="form-text">
                    We'll check the current weather in this location
                  </small>
                </div>

                <button
                  type="submit"
                  className="submit-btn"
                  disabled={loading}
                  aria-busy={loading}
                >
                  {loading ? "Checking..." : "Check Food Suitability"}
                </button>
              </form>
            </div>
          )}

          {activeTab === "check" && (
            <div className="check-tab-content" ref={resultsRef}>
              {!foodItem && !weatherData && !result ? (
                <div className="food-entry-card">
                  <p className="card-description">
                    Please enter a food item and submit to check its
                    suitability.
                  </p>
                </div>
              ) : loading ? (
                <div className="food-entry-card">
                  <p className="card-description">Loading results...</p>
                </div>
              ) : (
                <>
                  {weatherData && (
                    <div className="weather-suitability-container">
                      <div className="result-card weather-card">
                        <h3>Weather Information</h3>
                        <div className="weather-info">
                          <div className="weather-main">
                            <p className="temp">
                              {renderTemperature(weatherData.temperature)}
                            </p>
                            <p className="condition">
                              {weatherData.weatherCondition}
                            </p>
                            <p className="category">{weatherData.category}</p>
                          </div>
                          <div className="weather-details">
                            <p>
                              <strong>Location:</strong>{" "}
                              {weatherData.location || formData.location}
                            </p>
                            <p>
                              <strong>Humidity:</strong> {weatherData.humidity}%
                            </p>
                            <p>
                              <strong>Wind Speed:</strong>{" "}
                              {weatherData.windSpeed} km/h
                            </p>
                          </div>
                        </div>
                      </div>

                      {result && (
                        <div className="result-card suitability-card">
                          <h3>Suitability Result</h3>
                          <div className="food-info">
                            <p>
                              <strong>Food Item:</strong> {foodItem}
                            </p>
                            {user && (
                              <p>
                                <strong>BMI Category:</strong>{" "}
                                {user.bmiCategory}
                              </p>
                            )}
                          </div>

                          <div
                            className={`suitability-result ${
                              result.suitable ? "suitable" : "not-suitable"
                            }`}
                          >
                            <h4>
                              {foodItem} is{" "}
                              <span
                                className={
                                  result.suitable ? "suitable" : "not-suitable"
                                }
                              >
                                {result.suitable ? "suitable" : "not suitable"}
                              </span>{" "}
                              for consumption in the current weather.
                            </h4>
                            <div className="suitability-details">
                              <p>{result.explanation}</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {checkTabRecommendations &&
                  checkTabRecommendations.length > 0 ? (
                    <div className="check-tab-recommendations">
                      <div className="result-card recommendations-card">
                        <h3>Recommended Foods</h3>
                        <div className="weather-summary">
                          <p>
                            <strong>Weather Type:</strong>{" "}
                            {weatherData?.category || "Unknown"}
                          </p>
                          <p>
                            <strong>Temperature:</strong>{" "}
                            {renderTemperature(weatherData?.temperature)}
                          </p>
                          <p>
                            <strong>Your BMI Category:</strong>{" "}
                            {user?.bmiCategory || "Unknown"}
                          </p>
                        </div>

                        <div className="recommended-foods">
                          <h4>
                            Here are some foods recommended for the current
                            weather:
                          </h4>
                          <ul className="foods-list">
                            {checkTabRecommendations.map((food, index) => (
                              <li
                                key={index}
                                className={`food-item calories-${
                                  food.calorieLevel?.toLowerCase() || "medium"
                                }-item`}
                              >
                                <div className="food-header">
                                  <h4>{food.name}</h4>
                                  <span
                                    className={`calories calories-${
                                      food.calorieLevel?.toLowerCase() ||
                                      "medium"
                                    }`}
                                  >
                                    {food.calorieLevel || "Medium"}
                                  </span>
                                </div>
                                <p className="description">
                                  {food.description ||
                                    "No description available"}
                                </p>
                                <div className="tags">
                                  <span className="tag weather">
                                    {food.weatherType ||
                                      weatherData?.category ||
                                      "All Weather"}
                                  </span>
                                  <span className="tag bmi">
                                    {food.bmiCategory ||
                                      user?.bmiCategory ||
                                      "All BMI"}
                                  </span>
                                </div>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="check-tab-recommendations">
                      <div className="result-card recommendations-card">
                        <h3>Recommended Foods</h3>
                        <p className="card-description">
                          {recommendationsError ||
                            `No specific food recommendations are available for ${formData.location}. Please try another location or contact support if you believe this is an error.`}
                        </p>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FoodEntry;
