import { BrowserRouter, Routes, Route } from "react-router-dom";
import Homepage from "./pages/Homepage";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import Wrapper from "./pages/Wrapper";
import { ActiveComponentProvider } from "./helper/activeComponent";
import ChannelManager from "./assets/components/ChannelManager";

function App() {
  return (
    <ActiveComponentProvider>
      <BrowserRouter>
        <Routes>
          {/* Homepage as default */}
          <Route path="/" element={<Homepage />} />

          {/* Authentication */}
          <Route path="/login" element={<LoginPage />} />

          {/* Dashboard */}

          <Route
            path="/dashboard"
            element={
              <Wrapper>
                <Dashboard />
              </Wrapper>
            }
          />
          <Route path="/channels" element={<ChannelManager />}></Route>
        </Routes>
      </BrowserRouter>
    </ActiveComponentProvider>
  );
}

export default App;
