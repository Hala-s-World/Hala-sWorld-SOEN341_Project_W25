import React, {useState} from 'react'
import supabase from '../helper/supabaseClient'
import {Link} from 'react-router-dom'

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
      <h2>Register</h2>
      <br></br>
      {message && <span>{message}</span>}
      <form onSubmit={handleSubmit}>
        <input
          type='email' 
          placeholder='Email' 
          required 
          onChange={(e) => setEmail(e.target.value)}></input>
        <input 
          type='password' 
          placeholder='Password'
          value={password}
          required 
          onChange={(e) => setPassword(e.target.value)}></input>
        <button type='submit'>Create Account</button>
      </form>
      <span>Already have an account?</span>
      <Link to="/login">Login</Link>
    </div>
  )
}

export default Register