import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import "./style.css";

const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { login, isLoggedIn } = useAuth();

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    login(username, password);
  };

  useEffect(() => {
    if (isLoggedIn) {
      navigate("/home");
    }
  }, [isLoggedIn]);

  return (
    <div className="container">
      <h1>Admin</h1>
      <form className="form-container" onSubmit={handleSubmit}>
        <input
          className="input"
          type="text"
          value={username}
          onChange={handleUsernameChange}
          placeholder="User ID"
        />
        <br />
        <input
          className="input"
          type="password"
          value={password}
          onChange={handlePasswordChange}
          placeholder="Password"
        />
        <br />
        <button className="login-button" type="submit">
          Login
        </button>
      </form>
    </div>
  );
};

export default LoginForm;
