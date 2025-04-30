const express = require("express");
const router = express.Router();
const {
  registerUser,
  getUserProfile,
  authUser,
} = require("../controllers/userController");

// Routes
router.post("/", registerUser);
router.post("/login", authUser);

// Debug route - check if users exist
router.get("/debug", async (req, res) => {
  try {
    const { email } = req.query;
    const User = require("../models/User");

    if (email) {
      const user = await User.findOne({ email });
      if (user) {
        return res.status(200).json({
          message: "User found",
          email: user.email,
          _id: user._id,
          name: user.name,
        });
      } else {
        return res
          .status(404)
          .json({ message: "User not found with this email" });
      }
    }

    const count = await User.countDocuments();
    return res
      .status(200)
      .json({ message: `Total users in database: ${count}` });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// Route with parameter must be after specific routes
router.get("/:id", getUserProfile);

module.exports = router;
