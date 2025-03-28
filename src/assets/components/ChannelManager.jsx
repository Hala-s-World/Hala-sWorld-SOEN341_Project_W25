import React, { useState } from "react";
import { FaPlus } from "react-icons/fa";
import { useActiveComponent } from "../../helper/activeComponent";
import "../styles/channelmanager.css"
import { useAuthStore } from "../../store/authStore";
import ChannelCard from "./ChannelCard";
import AddChannel from "./AddChannel";
import ChannelList from "./ChannelList";


export default function ChannelManager() {

    const { user } = useAuthStore();
    const { role } = useAuthStore();
    const [channels, setChannels] = useState([]);

    const { setActiveComponent } = useActiveComponent()

    const handleClick = (componentName) => {
        setActiveComponent(componentName);
    }

    const [isModalOpen, setIsModalOpen] = useState(false);
    const toggleModal = () => {
        setIsModalOpen(!isModalOpen);
    };


    return (
        <div className="main">
            <div className="channels-container">
                <div className="channels-title-your-channels">YOUR CHANNELS</div>
                <div className="opened-channels-box">
                    
                    <ChannelList/>
                    {true &&
                        <div className="add-channel" onClick={toggleModal}>
                            <FaPlus className="sidebar-icon"></FaPlus>Add a new channel
                        </div>}
                    {/* Modal to Show AddChannel Component */}
                    {isModalOpen && (
                        <div className="modal-overlay" onClick={toggleModal}>
                            <div
                                className="modal-content"
                                onClick={(e) => e.stopPropagation()} // Prevent closing on modal click
                            >
                                <h3>Add New Channel</h3>
                                {/* Render AddChannel Component */}
                                <AddChannel />
                                <button onClick={toggleModal} className="close-btn">
                                    Cancel
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}