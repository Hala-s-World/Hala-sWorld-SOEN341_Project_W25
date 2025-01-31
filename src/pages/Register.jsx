import React, {useState} from 'react'
import supabase from '../helper/supabaseClient'

function Register() {

  const [email,setEmail] = useState("")
  const [password,setPassword] = useState("")
  const [message,setMessage] = useState("")

  const handleSubmit = async (event) => {
    event.preventDefault()
    setMessage("")
    const {data, error} = await supabase.auth.signUp({
      email: email,
      password: password
    })

    if(error){
      setMessage(error.message) 
      return
    }

    if(data){
      setMessage("User Account created!")
    }

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
    </div>
  )
}

export default Register