import React, {useState} from 'react'
import supabase from '../../helper/supabaseClient'
import AuthenticationForm from './AuthenticationForm'

const Register = () => {

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
     <AuthenticationForm title="REGISTER"  handleSubmit={handleSubmit}></AuthenticationForm>
  )
}

export default Register