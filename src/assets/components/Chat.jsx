import React, { useState } from "react";
import SendMessage from "./SendMessage";
import ReceiveMessage from "./ReceiveMessage";
import "../styles/dashboard.css";

//Deprecated
export default function Chat({
  messages,
  user,
  error,
  message,
  setMessage,
  handleSendMessage,
  isSending,
  header,
}) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredMessages = messages.filter((msg) =>
    msg.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="main">
      <div className="chat-container">
        <div className="opened-chat-banner">{header}</div>
        <div className="opened-chat-box">
          {/* SEARCH BAR */}
          <div className="chat-search-bar">
            <input
              type="text"
              className="chat-search-input"
              placeholder="Search messages..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* MESSAGES AREA */}
          <div className="chat-messages">
            <ReceiveMessage
              messages={filteredMessages}
              user={user}
              error={error}
            />
          </div>
          {/* INPUT AREA */}
          <div className="chat-box-chat">
            <SendMessage
              message={message}
              setMessage={setMessage}
              handleSendMessage={handleSendMessage}
              isSending={isSending}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
