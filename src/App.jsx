import { BrowserRouter, Routes, Route } from "react-router-dom";
import Homepage from "./pages/Homepage";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import { ActiveComponentProvider } from "./helper/activeComponent";
import ChannelManager from "./assets/components/ChannelManager";
import SettingsPage from "./pages/SettingsPage";
import UserProfile from "./pages/UserProfile";

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
          <Route path="/dashboard" element={<Dashboard />} />

          {/* Channels */}
          <Route path="/channels" element={<ChannelManager />} />

          {/* Profile and Settings */}
          {/* No longer needed because we'll use Dashboard to handle these */}
          <Route path="/profile/:id" element={<UserProfile />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </BrowserRouter>
    </ActiveComponentProvider>
  );
}

export default App;
