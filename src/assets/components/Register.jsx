import supabase from "../../helper/supabaseClient";
import AuthenticationForm from "./AuthenticationForm";
import { useNavigate } from "react-router-dom";
import SupabaseAPI from "../../helper/supabaseAPI";

const Register = () => {
  const navigate = useNavigate();
  // const { setErrorMessage } = useAuthStore(); 

  const handleSubmit = async (event, email, password) => {
    event.preventDefault();

    console.log("Registered successfully:", signUpData);

    // try {
    //   SupabaseAPI.signUp(email,password)
    //   SupabaseAPI.createUser(signUpData.user.id,"temp_username" )
    //   SupabaseAPI.createUserRole(signUpData.user.id)
    // } catch (error) {
    //   console.log(error)
    // }

    const {error: userInsertError } = await supabase
      .from("user")
      .insert({ id: signUpData.user.id, username: "temp_username" });

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
    navigate("/dashboard"); // Navigate to a welcome page or another route after successful registration
  };

  return (
    <div>
      <AuthenticationForm title="REGISTER" handleSubmit={handleSubmit} />
    </div>
  );
};

export default Register;
