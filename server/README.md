# BMI and Food Weather Application Backend

This is the Node.js + Express backend for the BMI and Food Weather application.

## Features

- User registration with weight, age, and BMI calculation
- Food suitability check based on weather conditions and BMI
- Integration with OpenWeatherMap API for real-time weather data
- Weather information based on city
- CRUD operations for foods

## Tech Stack

- Node.js
- Express.js
- MongoDB with Mongoose
- dotenv for environment variables
- Axios for HTTP requests
- CORS for cross-origin resource sharing

## API Endpoints

### Users

- `POST /api/users`: Register a new user with weight, age, and height
- `GET /api/users/:id`: Get user profile by ID

### Foods

- `GET /api/foods`: Get all foods
- `POST /api/foods`: Add a new food
- `POST /api/foods/check`: Check if a food is suitable based on weather and BMI

### Weather

- `GET /api/weather?city=CityName`: Get weather information for the specified city

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```
PORT=5000
MONGO_URI=mongodb://localhost:27017/bmi_app
WEATHER_API_KEY=your_weather_api_key_here
```

## Setup and Running

1. Install dependencies:

   ```
   npm install
   ```

2. Seed the database with initial food data:

   ```
   npm run seed
   ```

3. Start the development server:

   ```
   npm run dev
   ```

4. For production:
   ```
   npm start
   ```

## Weather Conditions

The application maps OpenWeatherMap API conditions to the following categories:

- Hot (temperature > 25°C)
- Cold (temperature < 10°C)
- Rainy (weather codes 2xx, 3xx, 5xx)
- Sunny (weather code 800)
- Cloudy (weather codes 801-804)

## BMI Categories

- Underweight: < 18.5
- Normal: 18.5 - 24.9
- Overweight: 25 - 29.9
- Obese: >= 30
