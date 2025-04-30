import { useState, useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import FoodEntry from "./pages/FoodEntry";
import "./App.css";

function Preloader({ loading }) {
  return (
    <div className={`preloader ${loading ? "" : "hidden"}`}>
      <div className="preloader-spinner"></div>
    </div>
  );
}

function PageTransition({ children }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger the animation after component mount
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 10);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`page-transition ${isVisible ? "visible" : ""}`}>
      {children}
    </div>
  );
}

function App() {
  const location = useLocation();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate initial loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="app">
      <Preloader loading={loading} />

      <div className="page-container">
        <PageTransition key={location.pathname}>
          <Routes location={location}>
            <Route path="/" element={<Navigate to="/register" />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/food-entry" element={<FoodEntry />} />
          </Routes>
        </PageTransition>
      </div>
    </div>
  );
}

export default App;
