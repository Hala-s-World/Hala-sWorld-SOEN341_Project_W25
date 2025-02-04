import React, {useState} from 'react'
import { useAuthStore } from "../../store/authStore";
import { Link, useNavigate } from "react-router-dom";

export default function AuthenticationForm({handleSubmit, title}) {
  const navigate = useNavigate();
  const { errorMessage } = useAuthStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");


  return (
    <div >
    <form onSubmit={(event) => handleSubmit(event, email, password)}>
    <h1>{title}</h1>
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
    </form>
  </div>
  )
}
