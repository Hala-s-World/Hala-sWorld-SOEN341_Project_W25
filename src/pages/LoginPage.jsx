import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../assets/styles/authentication.css";
import Login from "../assets/components/Login";
import Register from "../assets/components/Register";

function LoginPage() {
  const navigate = useNavigate();
  const [isRegister, setIsRegister] = useState(false);

  const togglePanel = () => {
    setIsRegister(!isRegister);
  };

    return (
      <>
      <div className={`container ${isRegister ? "right-panel-active" : ""}`} id="container">
        <div className="form-container login-container">
        <Login />
        </div>
       <div className="form-container register-container">
        <Register />
      </div>
     

        <div className="overlay-container">
          <div className="overlay">
            <div className="overlay-panel overlay-left">
              <h1 className="title">LOG INTO ACCOUNT</h1>
              <p>If you already have an account, just login!</p>
              <button className="ghost" onClick={() => setIsRegister(false)} id="login">
                LOGIN
              </button>
            </div>
            <div className="overlay-panel overlay-right">
              <h1 className="title">CREATE AN ACCOUNT</h1>
              <p>If you don't have an account yet, join us!</p>
              <button className="ghost" onClick={() => setIsRegister(true)} id="register">
                REGISTER
              </button>
            </div>
          </div>
        </div>
      </div>
   </>
  );
}

export default LoginPage;
