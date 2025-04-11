import React, { useState } from "react";
import "../assets/styles/dashboard.css";
import { FaBars } from "react-icons/fa";
import DirectMessaging from "../assets/components/DirectMessaging";
import SideBar from "../assets/components/SideBar";
import { useActiveComponent } from "../helper/activeComponent";
import ChannelManager from "../assets/components/ChannelManager";
import FriendsPage from "./FriendsPage";
import DashboardHome from "./DashboardHome";
import UserSearchBar from "../assets/components/UserSearchBar";
import SettingsPage from "./SettingsPage";

function Dashboard() {
  const { activeComponent } = useActiveComponent("DashboardHome");

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
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
        <div className="dashboard-header">
          <div className="search-bar-wrapper">
            <UserSearchBar />
          </div>
        </div>
        {activeComponent === "Settings" && <SettingsPage />}
        {activeComponent === "Direct-Messaging" && <DirectMessaging />}
        {activeComponent === "Friends-Page" && <FriendsPage />}
        {activeComponent === "ChannelManager" && <ChannelManager />}
        {activeComponent === "DashboardHome" && <DashboardHome />}
      </div>
    </div>
  );
}

export default Dashboard;
