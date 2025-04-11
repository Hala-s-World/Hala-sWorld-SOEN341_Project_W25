import React, { useState, useEffect } from "react";
import {
  FaCalendarAlt,
  FaComment,
  FaHome,
  FaFileAlt,
  FaCog,
  FaAngleDown,
  FaUserFriends,
  FaSatelliteDish,
} from "react-icons/fa";
import supabase from "../../helper/supabaseClient";
import "../styles/sidebar.css";
import { useActiveComponent } from "../../helper/activeComponent";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import GetUserStatus from "./GetUserStatus";

export default function SideBar({ isSidebarOpen, setIsSidebarOpen }) {
  const { setActiveComponent } = useActiveComponent();
  const [isOpen, setIsOpen] = useState(false);
  const { role } = useAuthStore();
  const [username, setUsername] = useState(null);
  const [avatar, setAvatar] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleClick = (componentName) => {
    setActiveComponent(componentName);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Error logging out:", error.message);
    }
  };

  const goToProfile = () => {
    if (user?.id) {
      navigate(`/profile/${user.id}`);
    }
  };

  useEffect(() => {
    if (!user) return;

    const fetchUserProfile = async () => {
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("full_name, avatar_url") // Fetch avatar_url instead of avatar
          .eq("id", user.id)
          .single();

        if (data) {
          setUsername(data.full_name);
          setAvatar(data.avatar_url); // Set the avatar URL directly
        }

        if (error) console.error("Error fetching profile:", error.message);
      } catch (error) {
        console.error("Error fetching profile:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();

    // Subscribe to real-time updates for the user's profile
    const subscription = supabase
      .channel("public:profiles")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "profiles",
          filter: `id=eq.${user.id}`, // Listen only for updates to the current user's profile
        },
        (payload) => {
          console.log("Profile updated in real-time:", payload);
          if (payload.new.avatar_url) {
            setAvatar(payload.new.avatar_url); // Update the avatar URL
          }
        }
      )
      .subscribe();

    // Cleanup the subscription on component unmount
    return () => {
      supabase.removeChannel(subscription);
    };
  }, [user]);

  return (
    <div className={`sidebar ${isSidebarOpen ? "open" : "closed"}`}>
      <div className="user-profile">
        <div className="user-picture-container">
          <img
            className="user-picture"
            src={
              avatar ||
              "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTZ0FpBg5Myb9CQ-bQpFou9BY9JXoRG6208_Q&s" // Default avatar if none selected
            }
            alt="User"
          />
        </div>
        <div className="user-name">
          {username}
          <div className="status">
            <GetUserStatus />
          </div>
          <span>
            <FaAngleDown className="dropdown-icon" />
          </span>
          <div className="dropdown">
            <div className="dropdown-list">
              <div className="dropdown-item" onClick={goToProfile}>
                Profile
              </div>
              <div className="dropdown-item" onClick={handleLogout}>
                Logout
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="elements-container">
        <div
          className="sidebar-element"
          onClick={() => handleClick("DashboardHome")}
        >
          <FaHome className="sidebar-icon" /> Home
        </div>
        <div
          className="sidebar-element"
          onClick={() => handleClick("Friends-Page")}
        >
          <FaUserFriends className="sidebar-icon" /> Friends
        </div>
        <div
          className="sidebar-element"
          onClick={() => handleClick("ChannelManager")}
        >
          <FaSatelliteDish className="sidebar-icon" /> Channels
        </div>
        <div
          className="sidebar-element"
          onClick={() => handleClick("Settings")}
        >
          <FaCog className="sidebar-icon" /> Settings
        </div>
      </div>
    </div>
  );
}
