import React, {useState} from 'react'
import { useAuthStore } from "../../store/authStore";
import { Link, useNavigate } from "react-router-dom";

export default function AuthenticationForm({isLogin, handleSubmit, title}) {
  const navigate = useNavigate();
  const { login, logout, errorMessage } = useAuthStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  let content

  if(isLogin){
    content = 
    <div id="loginDiv">
      <span>Don't have an account? </span>
      <Link to="/register" id="loginLink">Register</Link>
    </div>
  }else{
    content = 
    <div id="loginDiv">
      <span>Already have an account? </span>
      <Link to="/login" id="loginLink">Login</Link>
    </div>
  }

  //switch between 
  return (
    <div className="login-container">
    <h1>{title}</h1>
    <form onSubmit={(event) => handleSubmit(event, email, password)}>
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
      <button type="submit">{title}</button>
      {content}
    </form>
  </div>
  )
}
