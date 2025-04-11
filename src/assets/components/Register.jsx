import supabase from "../../helper/supabaseClient";
import AuthenticationForm from "./AuthenticationForm";
import SupabaseAPI from "../../helper/supabaseAPI";
import { useAuthStore } from "../../store/authStore";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const Register = () => {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (event, email, password) => {
    event.preventDefault();

    setErrorMessage("");

    try {
      // Sign up the user
      const { user } = await SupabaseAPI.signUp(email, password);

      console.log("SignUp Response:", user); // Debugging log

      if (!user) {
        setErrorMessage("Signup failed: No user data returned.");
        return;
      }

      const userId = user.id; // Get the user's ID

      // Log out the user after signup
      await supabase.auth.signOut();

      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || sessionData?.session) {
        setErrorMessage("Failed to clear session before logging in new user.");
        return;
      }

      // Log in the new user
      const { user: loggedInUser, session, error: loginError } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (loginError) {
        setErrorMessage("Login failed after signup: " + loginError.message);
      } else {
        console.log("New user logged in successfully");

        // Set the user and session in authStore
        setAuthState(loggedInUser, session);

        // Navigate to the dashboard
        navigate("/dashboard");
      }
    } catch (error) {
      console.log("Error signing up:", error.message);
      setErrorMessage("An error occurred during the signup process.");
    }
  };

  const setAuthState = (user, session) => {
    const { setAuthenticatedUser, setSession } = useAuthStore.getState();
    setAuthenticatedUser(user); // Set the user in authStore
    setSession(session); // Set the session in authStore
  };

  return (
    <div>
      <AuthenticationForm title="REGISTER" handleSubmit={handleSubmit} />
      {errorMessage && (
        <div
          style={{
            color: "red",
            fontSize: "12px",
            marginTop: "10px",
            justifyItems: "center",
            alignItems: "center",
            textAlign: "center",
          }}
        >
          {errorMessage}
        </div>
      )}
    </div>
  );
};

export default Register;
