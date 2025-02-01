import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Wrapper from "./pages/Wrapper";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Login */}
        <Route path="/" element={<Login/>} />

        {/* register */}
        <Route path="/register" element={<Register />} />

        {/* dashboard */}
        <Route
          path="/dashboard"
          element={
            <Wrapper>
              <Dashboard />
            </Wrapper>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
