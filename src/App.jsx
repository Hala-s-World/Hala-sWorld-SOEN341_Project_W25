import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./assets/components/Register";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import Wrapper from "./pages/Wrapper";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Login */}
        <Route path="/" element={<LoginPage />} />
       
        {/* dashboard */}
        <Route
          path="/dashboard"
          element={
            // <Wrapper>
              <Dashboard />
            // </Wrapper>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
