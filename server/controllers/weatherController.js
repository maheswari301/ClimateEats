const axios = require("axios");

// Mock weather data for testing
const mockWeatherData = {
  London: {
    name: "London",
    sys: { country: "GB" },
    main: {
      temp: 18.5,
      temp_min: 16.2,
      temp_max: 20.1,
      feels_like: 18.1,
      humidity: 72,
    },
    wind: { speed: 4.2, deg: 250 },
    weather: [{ id: 802, main: "Clouds", description: "scattered clouds" }],
    dt: Math.floor(Date.now() / 1000),
  },
  "New York": {
    name: "New York",
    sys: { country: "US" },
    main: {
      temp: 26.2,
      temp_min: 24.5,
      temp_max: 27.8,
      feels_like: 27.6,
      humidity: 65,
    },
    wind: { speed: 3.1, deg: 180 },
    weather: [{ id: 800, main: "Clear", description: "clear sky" }],
    dt: Math.floor(Date.now() / 1000),
  },
  Tokyo: {
    name: "Tokyo",
    sys: { country: "JP" },
    main: {
      temp: 28.5,
      temp_min: 26.8,
      temp_max: 30.2,
      feels_like: 31.1,
      humidity: 80,
    },
    wind: { speed: 2.8, deg: 120 },
    weather: [{ id: 500, main: "Rain", description: "light rain" }],
    dt: Math.floor(Date.now() / 1000),
  },
  Sydney: {
    name: "Sydney",
    sys: { country: "AU" },
    main: {
      temp: 22.3,
      temp_min: 20.8,
      temp_max: 24.6,
      feels_like: 22.9,
      humidity: 62,
    },
    wind: { speed: 5.2, deg: 160 },
    weather: [{ id: 801, main: "Clouds", description: "few clouds" }],
    dt: Math.floor(Date.now() / 1000),
  },
  Paris: {
    name: "Paris",
    sys: { country: "FR" },
    main: {
      temp: 17.8,
      temp_min: 15.3,
      temp_max: 19.2,
      feels_like: 17.4,
      humidity: 68,
    },
    wind: { speed: 3.6, deg: 220 },
    weather: [{ id: 500, main: "Rain", description: "light rain" }],
    dt: Math.floor(Date.now() / 1000),
  },
  Dubai: {
    name: "Dubai",
    sys: { country: "AE" },
    main: {
      temp: 36.7,
      temp_min: 35.1,
      temp_max: 38.4,
      feels_like: 40.2,
      humidity: 45,
    },
    wind: { speed: 4.0, deg: 120 },
    weather: [{ id: 800, main: "Clear", description: "clear sky" }],
    dt: Math.floor(Date.now() / 1000),
  },
};

// Default city data for any unknown city
const defaultCity = {
  name: "Unknown City",
  sys: { country: "World" },
  main: {
    temp: 22.0,
    temp_min: 20.0,
    temp_max: 24.0,
    feels_like: 22.5,
    humidity: 65,
  },
  wind: { speed: 3.0, deg: 180 },
  weather: [{ id: 800, main: "Clear", description: "clear sky" }],
  dt: Math.floor(Date.now() / 1000),
};

// Utility function to map OpenWeather conditions to our app's categories
const mapWeatherCondition = (weatherId, temp) => {
  // Weather condition mapping based on OpenWeatherMap API
  if (temp > 25) return "Hot";
  if (temp < 10) return "Cold";

  // Check weather codes
  // Rain: 2xx (thunderstorm), 3xx (drizzle), 5xx (rain)
  if ([2, 3, 5].includes(Math.floor(weatherId / 100))) return "Rainy";

  // Clear: 800
  if (weatherId === 800) return "Sunny";

  // Clouds: 801-804
  if (weatherId >= 801 && weatherId <= 804) return "Cloudy";

  // Wind: no direct code, would need wind speed data
  return "Any";
};

// @desc    Get weather information by city
// @route   GET /api/weather
// @access  Public
const getWeatherByCity = async (req, res) => {
  try {
    const { city } = req.query;

    if (!city) {
      return res.status(400).json({ message: "Please provide a city name" });
    }

    // Normalize city name for better mock data matching
    const normalizedCity =
      Object.keys(mockWeatherData).find(
        (c) => c.toLowerCase() === city.toLowerCase()
      ) || city;

    console.log(
      `Weather requested for city: ${city}, normalized to: ${normalizedCity}`
    );

    // Try to fetch from real API if key exists
    if (process.env.WEATHER_API_KEY) {
      try {
        console.log(
          `Attempting API call with key: ${process.env.WEATHER_API_KEY.substring(
            0,
            5
          )}...`
        );
        const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.WEATHER_API_KEY}&units=metric`;

        const weatherResponse = await axios.get(apiUrl);

        console.log("API call successful");
        const weatherData = weatherResponse.data;
        processAndSendWeatherData(weatherData, res);
        return;
      } catch (apiError) {
        console.error("Weather API Error:", apiError.message);
        if (apiError.response) {
          console.error("API Response Status:", apiError.response.status);
          console.error(
            "API Response Data:",
            JSON.stringify(apiError.response.data)
          );
        }
        console.log(`Falling back to mock data for ${normalizedCity}`);
      }
    } else {
      console.log("No API key found in environment variables");
    }

    // Generate random temp variations for unknown cities to make mock data look realistic
    if (!mockWeatherData[normalizedCity] && normalizedCity === city) {
      // Generate a somewhat realistic mock data for this city
      console.log(`Creating new random mock data for ${city}`);

      const randomTemp = Math.floor(15 + Math.random() * 20); // Random temp between 15-35°C
      const randomHumidity = Math.floor(40 + Math.random() * 50); // Random humidity between 40-90%
      const randomWind = Math.floor(2 + Math.random() * 6); // Random wind between 2-8 m/s

      // Weather conditions based on random selection
      const weatherConditions = [
        { id: 800, main: "Clear", description: "clear sky" },
        { id: 801, main: "Clouds", description: "few clouds" },
        { id: 802, main: "Clouds", description: "scattered clouds" },
        { id: 500, main: "Rain", description: "light rain" },
      ];
      const randomWeather =
        weatherConditions[Math.floor(Math.random() * weatherConditions.length)];

      mockWeatherData[city] = {
        name: city,
        sys: { country: "Unknown" },
        main: {
          temp: randomTemp,
          temp_min: randomTemp - 2,
          temp_max: randomTemp + 2,
          feels_like: randomTemp - 0.5,
          humidity: randomHumidity,
        },
        wind: { speed: randomWind, deg: Math.floor(Math.random() * 360) },
        weather: [randomWeather],
        dt: Math.floor(Date.now() / 1000),
      };
    }

    // Use mock data
    console.log(`Using mock weather data for ${normalizedCity}`);
    const mockData = mockWeatherData[normalizedCity] || {
      ...defaultCity,
      name: city,
    };
    processAndSendWeatherData(mockData, res);
  } catch (error) {
    console.error("Weather error:", error.message);
    res.status(500).json({
      message: error.message,
    });
  }
};

// Helper to process and send weather data
const processAndSendWeatherData = (weatherData, res) => {
  const currentTemp = weatherData.main.temp;
  const weatherId = weatherData.weather[0].id;
  const weatherMain = weatherData.weather[0].main;
  const weatherDescription = weatherData.weather[0].description;
  const weatherCondition = mapWeatherCondition(weatherId, currentTemp);

  res.status(200).json({
    city: weatherData.name,
    country: weatherData.sys.country,
    temperature: {
      current: currentTemp,
      min: weatherData.main.temp_min,
      max: weatherData.main.temp_max,
      feels_like: weatherData.main.feels_like,
    },
    humidity: weatherData.main.humidity,
    wind: {
      speed: weatherData.wind.speed,
      direction: weatherData.wind.deg,
    },
    weather: {
      main: weatherMain,
      description: weatherDescription,
      condition: weatherCondition,
    },
    timestamp: new Date(weatherData.dt * 1000),
  });
};

module.exports = {
  getWeatherByCity,
};
