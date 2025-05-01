const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

// Load environment variables
dotenv.config();

const app = express();

const allowedOrigins = ['https://climate-eats-cuyx.vercel.app'];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Import routes
const userRoutes = require("./routes/userRoutes");
const foodRoutes = require("./routes/foodRoutes");
const weatherRoutes = require("./routes/weatherRoutes");

// Use routes
app.use("/api/users", userRoutes);
app.use("/api/foods", foodRoutes);
app.use("/api/weather", weatherRoutes);

// Root route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Error middleware
app.use(notFound);
app.use(errorHandler);

// Start server without waiting for MongoDB
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Try to connect to MongoDB in the background
const mongoUri = process.env.MONGO_URI

mongoose
  .connect(mongoUri)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
    console.log(
      "Server running without MongoDB connection. Some features may not work."
    );
  });
