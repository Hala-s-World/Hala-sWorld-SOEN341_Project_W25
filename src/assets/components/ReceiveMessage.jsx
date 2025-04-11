import React, { useState, useEffect, useRef } from "react";
import { useAuthStore } from "../../store/authStore";
import supabase from "../../helper/supabaseClient";
import "../styles/channelmanager.css";

const ReceiveMessage = ({ messages, user, error, onMessageDelete }) => {
  const messagesEndRef = useRef(null);
  const { role } = useAuthStore();
  const [hoveredMessage, setHoveredMessage] = useState(null);
  const [avatars, setAvatars] = useState({}); // State to store avatars for each sender

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Fetch avatars for all senders
  useEffect(() => {
    const fetchAvatars = async () => {
      const uniqueSenderIds = [...new Set(messages.map((msg) => msg.sender_id))];
      const avatarMap = {};

      for (const senderId of uniqueSenderIds) {
        try {
          const { data, error } = await supabase
            .from("profiles")
            .select("avatar_url")
            .eq("id", senderId)
            .single();

          if (data?.avatar_url) {
            avatarMap[senderId] = data.avatar_url; // Store the avatar URL
          } else {
            avatarMap[senderId] =
              "https://byuc.wordpress.com/wp-content/uploads/2012/07/avat-2.jpg"; // Default avatar
          }

          if (error) {
            console.error(`Error fetching avatar for sender ${senderId}:`, error.message);
          }
        } catch (error) {
          console.error(`Error fetching avatar for sender ${senderId}:`, error.message);
          avatarMap[senderId] =
            "https://byuc.wordpress.com/wp-content/uploads/2012/07/avat-2.jpg"; // Default avatar in case of error
        }
      }

      setAvatars(avatarMap); // Update the avatars state
    };

    fetchAvatars();
  }, [messages]);

  const handleDeleteMessage = async (messageId) => {
    if (window.confirm("Are you sure you want to delete this message?")) {
      const { error } = await supabase
        .from("channel_messages")
        .delete()
        .eq("id", messageId);

      if (error) {
        console.error("Error deleting msg: ", error);
      } else {
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
          onMouseLeave={() => setHoveredMessage(null)}
        >
          <img
            className="chat-item-profile-picture"
            src={
              avatars[msg.sender_id] ||
              "https://byuc.wordpress.com/wp-content/uploads/2012/07/avat-2.jpg" // Default avatar
            }
            alt="User avatar"
          />
          <div className="chat-info">
            <div className="chat-header">
              <div className="chat-name">
                {msg.sender_id === user.id ? "You" : msg.sender.username}
              </div>
              <div className="chat-date">{msg.formattedDate}</div>
            </div>
            <div className="chat-text">{msg.content}</div>
          </div>
          {role === "admin" && hoveredMessage === msg.id && (
            <button
              className="delete-message-button"
              onClick={() => handleDeleteMessage(msg.id)}
            >
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
