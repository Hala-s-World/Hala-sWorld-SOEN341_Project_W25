import React, { useState } from "react";

function LoginOverlay({ isRegister, togglePanel }) {


  return (
    <div className="overlay-container">
          <div className="overlay">
            <div className="overlay-panel overlay-left">
              <h1 className="title">LOG INTO ACCOUNT</h1>
              <p>If you already have an account, just login!</p>
              <button className="ghost" onClick={() => togglePanel(false)} id="login">
                LOGIN
              </button>
            </div>
            <div className="overlay-panel overlay-right">
              <h1 className="title">CREATE AN ACCOUNT</h1>
              <p>If you don't have an account yet, join us!</p>
              <button className="ghost" onClick={() => togglePanel(true)} id="register">
                REGISTER
              </button>
            </div>
          </div>
        </div>
  );
}

export default LoginOverlay;