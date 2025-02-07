import React, { useState } from "react";
import supabase from "../helper/supabaseClient";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import "../assets/styles/dashboard.css";
import { FaBars, FaTimes, FaComments, FaCog, FaSlidersH, FaMicrophone, FaSmile, FaPaperclip, FaTelegram} from "react-icons/fa";
import ChatItem from "../assets/components/ChatItem";
import Chat from "../assets/components/Chat";
import SideBar from "../assets/components/SideBar";

function Dashboard() {
  const navigate = useNavigate();
  const { logout, errorMessage, role } = useAuthStore();

  const signOut = async () => {
    logout();
    if (errorMessage) throw errorMessage;
    navigate("/");
  };

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState("Messaging");



  return (
    <div className="dashboard">
      {/* <h1>Hello, you are logged in.</h1>
      {role === "admin" && <p>ADMIN TEST</p>}
      <button onClick={signOut}>Sign out</button> */}
      <SideBar />
      <Chat/>
    </div>
  );
}

export default Dashboard;
