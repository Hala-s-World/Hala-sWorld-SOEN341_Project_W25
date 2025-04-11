import React, { useState } from "react";
import { FaPlus } from "react-icons/fa";
import "../styles/channelmanager.css";
import { useAuthStore } from "../../store/authStore";
import AddChannel from "./AddChannel";
import ChannelChat from "./channelChat";
import ChannelList from "./ChannelList";

export default function ChannelManager() {
    const { role } = useAuthStore();
    const [selectedChannel, setSelectedChannel] = useState(null);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const toggleModal = () => {
        setIsModalOpen(!isModalOpen);
    };

    return (
        <div className="main">
            <div className="channels-container">
                {!selectedChannel ? (
                    <>
                        <div className="channels-title-your-channels">YOUR CHANNELS</div>
                        <div className="opened-channels-box">
                            <ChannelList
                                onSelectChannel={(channel) => setSelectedChannel(channel)} />
                            {role === "admin" && <div className="add-channel" onClick={toggleModal}>
                                <FaPlus className="sidebar-icon"></FaPlus>Add a new channel
                            </div>}
                            {isModalOpen && (
                                <div className="modal-overlay" onClick={toggleModal}>
                                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                                        <h3>Add New Channel</h3>
                                        <AddChannel />
                                        <button onClick={toggleModal} className="close-btn">
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                        
                    </>
                ) : (
                    <ChannelChat
                        channel={selectedChannel}
                        onBack={() => setSelectedChannel(null)}
                    />
                )}
            </div>
        </div>
    );
}