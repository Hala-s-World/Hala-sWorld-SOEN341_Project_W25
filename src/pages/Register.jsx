import React, {useState} from 'react'
import supabase from '../helper/supabaseClient'
import {Link} from 'react-router-dom'
import '/src/assets/styles/Authentication.css'

function Register() {

  const [email,setEmail] = useState("")
  const [password,setPassword] = useState("")
  const [message,setMessage] = useState("")

  const handleSubmit = async (event) => {
    event.preventDefault()
    setMessage("")

    //Authenticate user & email with supabase
    const {data, error} = await supabase.auth.signUp({
      email: email,
      password: password
    })

    //if error exists, display message
    if(error){
      setMessage(error.message) 
      return
    }

    //if success, display message
    if(data){
      setMessage("User Account created!")
    }

    //clear textbox
    setEmail("")
    setPassword("")
  }

  return (
    <div>
      <h1>REGISTER</h1>
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
        <button type='submit' id="registerButton">CREATE ACCOUNT</button>
      </form>
      <div id="loginDiv">
      <span>Already have an account? </span>
      <Link to="/login" id="loginLink">Login</Link>
      </div>
    </div>
  )
}

export default Register