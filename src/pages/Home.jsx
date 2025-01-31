import React from "react";
import { Link } from "react-router-dom";
import { Navigate } from "react-router-dom";

function Home() {
  return (
    <div>
      <Link to="/register">Register</Link>
      <br></br>
      <Link to="/login">Login</Link>
    </div>
  );
}

export default Home;
