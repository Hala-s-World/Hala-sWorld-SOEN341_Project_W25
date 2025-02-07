import React, { useState } from "react";
import supabase from "../helper/supabaseClient";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import "../assets/styles/dashboard.css";
import { FaBars, FaTimes, FaComments, FaCog, FaSlidersH, FaMicrophone, FaSmile, FaPaperclip, FaTelegram} from "react-icons/fa";
import ChatItem from "../assets/components/ChatItem";
import Chat from "../assets/components/Chat";
import SideBar from "../assets/components/SideBar";
import { useActiveComponent } from "../helper/activeComponent";
import ChannelManager from "../assets/components/ChannelManager";
import AddChannel from "../assets/components/AddChannel";
import "../assets/styles/channelmanager.css"

function Dashboard() {

  const navigate = useNavigate();
  const { logout, errorMessage, role } = useAuthStore();
  const {activeComponent} = useActiveComponent();


  const signOut = async () => {
    logout();
    if (errorMessage) throw errorMessage;
    navigate("/");
  };




  return (
    <div className="dashboard">
      {/* <h1>Hello, you are logged in.</h1>
      {role === "admin" && <p>ADMIN TEST</p>}
      <button onClick={signOut}>Sign out</button> */}
      <SideBar />
      {activeComponent === "Chat" && <Chat/>}
      {activeComponent === "Channel-Manager" && <AddChannel/>}
    </div>
  );
}

export default Dashboard;
