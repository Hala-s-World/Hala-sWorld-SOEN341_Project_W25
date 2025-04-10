import React, { useState, useEffect, useRef } from "react";
import { useAuthStore } from "../../store/authStore";
import supabase from "../../helper/supabaseClient";
import "../styles/channelmanager.css"



const ReceiveMessage = ({ messages, user, error, onMessageDelete }) => {
    const messagesEndRef = useRef(null);
    const { role } = useAuthStore();
    const [hoveredMessage, setHoveredMessage] = useState(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleDeleteMessage = async (messageId) => {
        if (window.confirm("Are you sure you want to delete this message?")) {
            const { error } = await supabase
                .from('channel_messages')
                .delete()
                .eq('id', messageId);

            if (error) {
                console.error("Error deleting msg: ", error);
            }
            else {
                onMessageDelete(messageId);
            }
        }
    };

    return (
        <div>
            {error && <div className="text-red-500">{error}</div>}


            {messages.map((msg, index) => (
                <div
                    key={index}
                    className="chat-message"
                    onMouseEnter={() => setHoveredMessage(msg.id)}
                    onMouseLeave={() => setHoveredMessage(null)}>
                    <img
                        className="chat-item-profile-picture"
                        src="https://byuc.wordpress.com/wp-content/uploads/2012/07/avat-2.jpg"
                        alt="User avatar"
                    />
                    <div className="chat-info">
                        <div className="chat-header">
                            <div className="chat-name">{msg.sender_id === user.id ? "You" : msg.sender.username}</div>
                            <div className="chat-date">{msg.formattedDate}</div>
                        </div>
                        <div className="chat-text">{msg.content}</div>
                    </div>
                    {role === "admin" && hoveredMessage === msg.id && (
                        <button
                        className="delete-message-button"
                        onClick={() => handleDeleteMessage(msg.id)}>
                            x
                        </button>
                    )}
                </div>
            ))}
            <div ref={messagesEndRef} />
        </div>
    );
};

export default ReceiveMessage;
