import React from "react";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import "./style.css";

const HomePage = () => {
  const { isLoggedIn } = useAuth();
  if (!isLoggedIn) {
    return <Navigate to="/" />;
  }
  return (
    <div className="upload-container">
      <Link to="/upload">
        <button className="upload-button">
          <span className="home-text">Upload Images/Videos</span>
        </button>
      </Link>
      <Link to="/users">
        <button className="upload-button">
          <span className="home-text">List of Users</span>
        </button>
      </Link>
    </div>
  );
};

export default HomePage;
