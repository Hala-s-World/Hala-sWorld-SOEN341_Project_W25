import React, { useState } from "react";
import SendMessage from "./SendMessage";
import ReceiveMessage from "./ReceiveMessage";

export default function Chat(){
  const [messages, setMessages] = useState([]); 

  const handleNewMessage = (newMessage) => {
    console.log("New message received:", newMessage);
    setMessages((prevMessages) => [...prevMessages, newMessage]); 
  };


  return (
    <div className="main">
      <div className="chat-container">
          <div className="opened-chat-banner">Chatbox title</div>
          <div className="opened-chat-box">
            {/* MESSAGES AREA */}
            <div className="chat-messages">
              <ReceiveMessage receiverId={"537f28ce-8b78-432a-84fe-b4d2740c97aa"} />
            </div>
            {/* INPUT AREA */}
            <div className="chat-box-chat">
            <SendMessage
            receiverId={"537f28ce-8b78-432a-84fe-b4d2740c97aa"}
            onMessageSent={handleNewMessage} 
          />
            </div>
          </div>
      </div>
    </div>
  );
}