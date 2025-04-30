const express = require("express");
const router = express.Router();
const foodController = require("../controllers/foodController");

// Routes
router.post("/check", foodController.checkFoodSuitability);
router.post("/", foodController.addFood);
router.get("/recommend", foodController.getRecommendedFoods);
router.get("/common", foodController.getCommonFoods);

module.exports = router;
