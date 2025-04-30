const express = require("express");
const router = express.Router();
const { getWeatherByCity } = require("../controllers/weatherController");

// Routes
router.get("/", getWeatherByCity);

module.exports = router;
