# BMI and Food Weather Frontend

This is the React frontend for the BMI and Food Weather application.

## Features

- User registration with BMI calculation
- Food suitability check based on weather and BMI
- Real-time weather information display
- Recommendations for alternative foods based on weather and BMI

## Tech Stack

- React.js
- React Router for navigation
- Axios for API requests
- CSS for styling

## Pages

- **Login** (`/login`): Register with weight, age, and height to calculate BMI
- **Food Entry** (`/food-entry`): Enter food and location to check suitability

## Setup and Running

1. Install dependencies:

   ```
   npm install
   ```

2. Start the development server:

   ```
   npm run dev
   ```

3. For production build:
   ```
   npm run build
   ```

## API Integration

The application integrates with the following backend API endpoints:

- `POST /api/users`: Register user with weight, age, and height
- `GET /api/weather?city=CityName`: Get weather information for a city
- `POST /api/foods/check`: Check food suitability based on weather and BMI

## Requirements

- Node.js 14.x or higher
- Backend API running on http://localhost:5000
