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
import ChatItem from "../assets/components/ChatItem";
import Chat from "../assets/components/Chat";
import SideBar from "../assets/components/SideBar";
import { useActiveComponent } from "../helper/activeComponent";
import ChannelManager from "../assets/components/ChannelManager";
import AddChannel from "../assets/components/AddChannel";
import "../assets/styles/channelmanager.css";

function Dashboard() {
  const navigate = useNavigate();
  const { logout, errorMessage, role } = useAuthStore();
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
        {activeComponent === "Chat" && <Chat />}
        {activeComponent === "Channel-Manager" && <AddChannel />}
      </div>
    </div>
  );
}

export default Dashboard;
