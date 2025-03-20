import React, { useState } from "react";
import {
  FaCalendarAlt,
  FaComment,
  FaHome,
  FaFileAlt,
  FaCog,
  FaAngleDown,
  FaUserFriends,
} from "react-icons/fa";
import "../styles/sidebar.css";
import { useActiveComponent } from "../../helper/activeComponent";
import { Link } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import ChannelManager from "./ChannelManager";
import FriendsPage from "../../pages/FriendsPage";
import { useEffect } from "react";
import GetUserStatus from "./GetUserStatus";

export default function SideBar({ isSidebarOpen, setIsSidebarOpen }) {
  const { setActiveComponent } = useActiveComponent();
  const [isOpen, setIsOpen] = useState(false);
  const { role } = useAuthStore();

  const handleClick = (componentName) => {
    setActiveComponent(componentName);
  };

  return (
    <div className={`sidebar ${isSidebarOpen ? "open" : "closed"}`}>
      <div className="user-profile">
        <div className="user-picture-container">
          <img
            className="user-picture"
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTZ0FpBg5Myb9CQ-bQpFou9BY9JXoRG6208_Q&s"
            alt="User"
          />
        </div>
        <div className="user-name">
        {username}
        <div className="status">
          <GetUserStatus></GetUserStatus>
        </div>
          <span>
            <FaAngleDown className="dropdown-icon" />
          </span>
          <div className="dropdown">
            <div className="dropdown-list">
              <div className="dropdown-item">Profile</div>
              <div className="dropdown-item">Log out</div>
            </div>
          </div>
        </div>
      </div>
      <div className="elements-container">
        <div className="sidebar-element" onClick={() => handleClick("Home")}>
          <FaHome className="sidebar-icon" /> Home
        </div>
        <div className="sidebar-element" onClick={() => handleClick("Direct-Messaging")}>
          <FaComment className="sidebar-icon" /> Chat
        </div>
        <div className="sidebar-element" onClick={() => handleClick("Calendar")}>
          <FaCalendarAlt className="sidebar-icon" /> Calendar
        </div>
        <div className="sidebar-element" onClick={() => handleClick("Documents")}>
          <FaFileAlt className="sidebar-icon" /> Documents
        </div>
        <div className="sidebar-element" onClick={() => handleClick("Settings")}>
          <FaCog className="sidebar-icon" /> Settings
        </div>
        <div className="sidebar-element"  onClick={() => handleClick("Friends-Page")}>       
            <FaUserFriends className="sidebar-icon" /> Friends
        </div>
        {role === "admin" && <ChannelManager />}
      </div>
    </div>
  );
}
