# Environment Setup

## Server Environment (.env file)

Create a `.env` file in the `server` directory with the following content:

```
MONGO_URI=mongodb://localhost:27017/bmi_app
WEATHER_API_KEY=your_openweather_api_key
PORT=5000
```

Replace `your_openweather_api_key` with your actual OpenWeatherMap API key. You can get a free API key by signing up at [OpenWeatherMap](https://openweathermap.org/api).

## Client Environment (.env file)

Create a `.env` file in the `client` directory with the following content:

```
VITE_API_URL=http://localhost:5000/api
```

This environment variable is not strictly necessary as we've configured a proxy in `vite.config.js`, but it's included for completeness.

## Proxy Configuration

The proxy configuration in `vite.config.js` forwards all requests starting with `/api` to the backend server running at `http://localhost:5000`. This allows you to make API requests without specifying the full URL, like:

```javascript
axios.get("/api/weather?city=London");
```

Instead of:

```javascript
axios.get("http://localhost:5000/api/weather?city=London");
```

This helps avoid CORS issues during development and simplifies API calls.

## Running the Application

1. Start the MongoDB server
2. Start the backend: `cd server && npm run dev`
3. Start the frontend: `cd client && npm run dev`
