import React, { useState } from "react";
import supabase from "../../helper/supabaseClient";
import AuthenticationForm from "./AuthenticationForm";

const Register = () => {
  const [message, setMessage] = useState("");

  const handleSubmit = async (event, email, password) => {
    event.preventDefault();
    setMessage("");

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    // if (error) {
    //   setMessage(error.message);
    //   return;
    // }

    if (data) {
      setMessage("User Account created! Check your email for verification.");
    }
  };

  return (
    <div>
      <AuthenticationForm title="REGISTER" handleSubmit={handleSubmit} />
    </div>
  );
};

export default Register;