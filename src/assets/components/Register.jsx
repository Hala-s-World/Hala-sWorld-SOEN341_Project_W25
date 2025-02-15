import React from "react";
import supabase from "../../helper/supabaseClient";
import AuthenticationForm from "./AuthenticationForm";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";

const Register = () => {
  const navigate = useNavigate();
  const { setErrorMessage } = useAuthStore(); 

  const handleSubmit = async (event, email, password) => {
    event.preventDefault();

    
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (signUpError) {
      console.log(signUpError);
      return false;
    }

    console.log("Registered successfully:", signUpData);

    
    const { data: userInsertData, error: userInsertError } = await supabase
      .from("user")
      .insert({ id: signUpData.user.id , username: "temp_username"}); 

    if (userInsertError) {
      console.log(userInsertError);
      return false;
    }

    
    const { error: roleInsertError } = await supabase
      .from("user_roles")
      .insert({ id: signUpData.user.id, role: "user" }); 

    if (roleInsertError) {
      console.log(roleInsertError);
      return false;
    }

    console.log("User role assigned successfully");
  };

  return (
    <div>
      <AuthenticationForm title="REGISTER" handleSubmit={handleSubmit} />
    </div>
  );
};

export default Register;
