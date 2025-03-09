import supabase from "../../helper/supabaseClient";
import AuthenticationForm from "./AuthenticationForm";
import SupabaseAPI from "../../helper/supabaseAPI";

import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
  // const { setErrorMessage } = useAuthStore(); 

  const handleSubmit = async (event, email, password) => {
    event.preventDefault();
 
   try {
      const signUpData = await SupabaseAPI.signUp(email,password)
      console.log(signUpData)
    } catch (error) {
      console.log(error)
    }

    console.log("User role assigned successfully");
    navigate("/dashboard"); // Navigate to a welcome page or another route after successful registration
  };

  return (
    <div>
      <AuthenticationForm title="REGISTER" handleSubmit={handleSubmit} />
    </div>
  );
};

export default Register;
