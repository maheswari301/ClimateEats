const mongoose = require("mongoose");

// Helper function to calculate BMI category
const getBmiCategory = (bmi) => {
  if (bmi < 18.5) return "Underweight";
  if (bmi >= 18.5 && bmi < 25) return "Normal";
  if (bmi >= 25 && bmi < 30) return "Overweight";
  return "Obese";
};

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email address",
      ],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password should be at least 6 characters"],
    },
    weight: {
      type: Number,
      required: [true, "Weight is required"],
    },
    age: {
      type: Number,
      required: [true, "Age is required"],
    },
    bmi: {
      type: Number,
      required: [true, "BMI is required"],
    },
    bmiCategory: {
      type: String,
      enum: ["Underweight", "Normal", "Overweight", "Obese"],
      // Set default value based on BMI during validation
      default: function () {
        return getBmiCategory(this.bmi);
      },
    },
  },
  {
    timestamps: true,
  }
);

// Pre-validate middleware to ensure bmiCategory is set
userSchema.pre("validate", function (next) {
  console.log("Pre-validate hook running with BMI:", this.bmi);

  // Make sure bmiCategory is set based on BMI value
  if (!this.bmiCategory && this.bmi) {
    this.bmiCategory = getBmiCategory(this.bmi);
    console.log("Setting bmiCategory to:", this.bmiCategory);
  }

  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
