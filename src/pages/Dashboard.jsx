import React, { useState } from "react";
import supabase from "../helper/supabaseClient";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import "../assets/styles/dashboard.css";
import {
  FaBars,
  FaTimes,
  FaComments,
  FaCog,
  FaSlidersH,
  FaMicrophone,
  FaSmile,
  FaPaperclip,
  FaTelegram,
} from "react-icons/fa";
import DirectMessaging from "../assets/components/DirectMessaging";
import SideBar from "../assets/components/SideBar";
import { useActiveComponent } from "../helper/activeComponent";
import ChannelManager from "../assets/components/ChannelManager";
import AddChannel from "../assets/components/AddChannel";
import "../assets/styles/channelmanager.css";
import FriendsPage from "./FriendsPage";
import DashboardHome from "./DashboardHome";

function Dashboard() {
  const navigate = useNavigate();
  const { logout, errorMessage, currentFriend } = useAuthStore();
  const { activeComponent } = useActiveComponent();

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const signOut = async () => {
    logout();
    if (errorMessage) throw errorMessage;
    navigate("/");
  };

  return (
    <div
      className={`dashboard ${
        isSidebarOpen ? "sidebar-open" : "sidebar-closed"
      }`}
    >
      {/* Toggle Button */}
      <button
        className="sidebar-toggle"
        onClick={toggleSidebar}
        style={{ left: isSidebarOpen ? "240px" : "10px" }}
      >
        <FaBars />
      </button>

      {/* Sidebar Component */}
      <SideBar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}

      />

      {/* Main Content */}
      <div className="main-content">
        {activeComponent === "Direct-Messaging" && <DirectMessaging />}
        {activeComponent === "Friends-Page" && <FriendsPage />}
        {activeComponent === "ChannelManager" && <ChannelManager/>}
        {activeComponent === "DashboardHome" && <DashboardHome/>}
      </div>
    </div>
  );
}

export default Dashboard;
