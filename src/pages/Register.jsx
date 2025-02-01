import React, {useState} from 'react'
import supabase from '../helper/supabaseClient'
import '/src/assets/styles/Authentication.css'
import AuthenticationForm from '../assets/Components/AuthenticationForm'

function Register() {

  const handleSubmit = async (event, email, password) => {
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
     <AuthenticationForm title="REGISTER" isLogin={false} handleSubmit={handleSubmit}></AuthenticationForm>
  )
}

export default Register