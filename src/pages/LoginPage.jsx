import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../assets/styles/authentication.css";
import Login from "../assets/components/Login";
import Register from "../assets/components/Register";
import LoginOverlay from "../assets/components/LoginOverlay";

function LoginPage() {
  const navigate = useNavigate();
  const [isRegister, setIsRegister] = useState(false);
  const togglePanel = () => {
    setIsRegister(!isRegister);
  };


    return (
      <div className={`container ${isRegister ? "right-panel-active" : ""}`} id="container">
        <div className="form-container login-container">
        <Login />
        </div>
        <div className="form-container register-container">
        <Register />
        </div> 
        <LoginOverlay isRegister={isRegister} togglePanel={togglePanel} />
      </div>
  );
}

export default LoginPage;
