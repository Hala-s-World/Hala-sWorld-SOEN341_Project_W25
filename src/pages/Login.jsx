import React, {useState} from 'react'
import supabase from '../helper/supabaseClient'
import {Link, useNavigate} from 'react-router-dom'
import '/src/assets/styles/Authentication.css'


function Login() {

  const navigate = useNavigate()
  const [email,setEmail] = useState("")
  const [password,setPassword] = useState("")
  const [message,setMessage] = useState("")

  const handleSubmit = async (event) => {
    event.preventDefault()
    setMessage("")

    //Authenticate user & email with supabase
    const {data, error} = await supabase.auth.signInWithPassword({
      email: email,
      password: password
    })

    //if error exists, display message
    if(error){
      setMessage(error.message) 
      //clear textbox
      setEmail("")
      setPassword("")
      return
    }

    //if success, display message
    if(data){
      navigate('/dashboard')
      return null
    }
  }

  return (
    <div>
          <h1>LOGIN</h1>
          {message && <span>{message}</span>}
          <form onSubmit={handleSubmit}>
            <input
              type='email' 
              placeholder='e-mail' 
              required 
              onChange={(e) => setEmail(e.target.value)}></input>
            <input 
              type='password' 
              placeholder='password'
              value={password}
              required 
              onChange={(e) => setPassword(e.target.value)}></input>
            <button type='submit'>LOGIN</button>
          </form>
          <div id="registerDiv">
          <span id="register">Don't have an account? </span>
            <Link to="/register" id="registerLink">Register</Link>
          </div>
        </div>
  )
}

export default Login