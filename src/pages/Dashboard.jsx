import React from "react";
import supabase from "../helper/supabaseClient";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

function Dashboard() {
  const navigate = useNavigate();
  const { logout, errorMessage, role } = useAuthStore();

  const signOut = async () => {
    logout();
    if (errorMessage) throw errorMessage;
    navigate("/");
  };

  return (
    <div>
      <h1>Hello, you are logged in.</h1>
      {role === "admin" && <p>ADMIN TEST</p>}
      <button onClick={signOut}>Sign out</button>
    </div>
  );
}

export default Dashboard;
