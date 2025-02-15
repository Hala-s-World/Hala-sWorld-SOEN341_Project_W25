import React, { useState } from "react";
import { useAuthStore } from "../../store/authStore";
import { Link, useNavigate } from "react-router-dom";
import AuthenticationForm from "./AuthenticationForm";


const Login = () =>{
  const navigate = useNavigate();
  const { login, errorMessage } = useAuthStore();

  const handleSubmit = async (email, password) => {
    const success = await login(email, password);
    console.log(success)
    if (success) {
      navigate("/dashboard");
    }
  };

  return (
    
    <AuthenticationForm title="LOGIN" handleSubmit={handleSubmit}></AuthenticationForm>
  );
};

export default Login;
