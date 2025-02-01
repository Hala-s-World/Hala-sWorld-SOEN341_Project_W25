import React, { useEffect, useState } from "react";
import { useAuthStore } from "../store/authStore";
import { Navigate } from "react-router-dom";

function Wrapper({ children }) {
  const {isAuthenticated, loading, authenticated} = useAuthStore()
  useEffect(() => {
    isAuthenticated()
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  } else {
    return authenticated ? <>{children}</> : <Navigate to="/"/>
  }
}

export default Wrapper;
