import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "../styles/Register.css";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    weight: "",
    age: "",
    height: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Only allow numbers for weight, height, and age
    if (name === "weight" || name === "height" || name === "age") {
      if (value === "" || /^\d+$/.test(value)) {
        setFormData((prevData) => ({
          ...prevData,
          [name]: value,
        }));
      }
    } else {
      // For non-numeric fields like name, email, password
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Validate inputs
      if (
        !formData.name ||
        !formData.email ||
        !formData.password ||
        !formData.weight ||
        !formData.age ||
        !formData.height
      ) {
        throw new Error("Please fill in all fields");
      }

      // Validate email format
      const emailRegex = /^[\w.-]+@[\w.-]+\.\w{2,}$/;
      if (!emailRegex.test(formData.email)) {
        throw new Error("Please enter a valid email address");
      }

      // Validate password length
      if (formData.password.length < 6) {
        throw new Error("Password must be at least 6 characters");
      }

      // Validate that numeric inputs are numerical
      if (
        !/^\d+$/.test(formData.weight) ||
        !/^\d+$/.test(formData.height) ||
        !/^\d+$/.test(formData.age)
      ) {
        throw new Error(
          "Please enter valid numbers for weight, height, and age"
        );
      }

      // Convert to numbers
      const userData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        weight: Number(formData.weight),
        age: Number(formData.age),
        height: Number(formData.height),
      };
      
      console.log("Converted values:", {
        weight: Number(formData.weight),
        height: Number(formData.height),
        age: Number(formData.age),
      });
      
      console.log("Submitting user data:", userData);

      // Make API call to register user - using proxy
      const response = await axios.post(`${import.meta.env.VITE_REACT_APP_BACKEND_BASE_URL}/api/users`, userData);

      console.log("Server response:", response.data);

      // Store user ID and name in local storage
      localStorage.setItem("userId", response.data._id);
      localStorage.setItem("bmiCategory", response.data.bmiCategory);
      localStorage.setItem("bmi", response.data.bmi);
      localStorage.setItem("userEmail", response.data.email);

      // Make sure we have a name to store
      if (response.data.name) {
        localStorage.setItem("userName", response.data.name);
        console.log("Name stored in localStorage:", response.data.name);
      } else {
        localStorage.setItem("userName", formData.name);
        console.log("Using form data name for localStorage:", formData.name);
      }

      // Navigate to food entry page
      navigate("/food-entry");
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <h2>ClimateEats</h2>
        <p>
          Register to calculate your BMI and get personalized food
          recommendations
        </p>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Your Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your name"
              required
              className="input-field"
              aria-label="Your name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
              className="input-field"
              aria-label="Your email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
              className="input-field"
              aria-label="Your password"
              minLength="6"
            />
          </div>

          <div className="form-group">
            <label htmlFor="weight">Weight (kg)</label>
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              id="weight"
              name="weight"
              value={formData.weight}
              onChange={handleChange}
              placeholder="Enter your weight in kg"
              required
              className="input-field"
              aria-label="Weight in kilograms"
            />
          </div>

          <div className="form-group">
            <label htmlFor="height">Height (cm)</label>
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              id="height"
              name="height"
              value={formData.height}
              onChange={handleChange}
              placeholder="Enter your height in cm"
              required
              className="input-field"
              aria-label="Height in centimeters"
            />
          </div>

          <div className="form-group">
            <label htmlFor="age">Age</label>
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              id="age"
              name="age"
              value={formData.age}
              onChange={handleChange}
              placeholder="Enter your age"
              required
              className="input-field"
              aria-label="Age in years"
            />
          </div>

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? "Registering..." : "Register & Calculate BMI"}
          </button>

          <div className="login-link">
            Already have an account? <Link to="/login">Login here</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
