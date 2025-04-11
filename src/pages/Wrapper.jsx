import React, { useEffect } from "react";
import { useAuthStore } from "../store/authStore";
import { Navigate } from "react-router-dom";
import PropTypes from "prop-types";

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

Wrapper.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Wrapper;
