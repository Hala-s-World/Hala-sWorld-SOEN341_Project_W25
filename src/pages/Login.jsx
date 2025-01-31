import React, { useState } from "react";
import { useAuthStore } from "../store/authStore";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const { login, errorMessage } = useAuthStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    const success = await login(email, password);

    if (success) {
      navigate("/dashboard");
    }
  };

  return (
    <div className="login-container">
      <h1>LOGIN</h1>
      <form onSubmit={handleSubmit}>
      {errorMessage && <span className="error-message">{errorMessage}</span>} 
        <input 
          type="email" 
          placeholder="e-mail" 
          value={email}
          onChange={(e) => setEmail(e.target.value)} 
          required 
        />
        <input 
          type="password" 
          placeholder="password" 
          value={password}
          onChange={(e) => setPassword(e.target.value)} 
          required 
        />
        <button type="submit">LOGIN</button>
        <div id="loginDiv">
          <span>Don't have an account? </span>
          <Link to="/register" id="loginLink">Register</Link>
        </div>
      </form>
    </div>
  );
};

export default Login;
