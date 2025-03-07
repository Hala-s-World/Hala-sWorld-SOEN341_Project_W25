import React, { useState } from "react";
import SendMessage from "./SendMessage";
import ReceiveMessage from "./ReceiveMessage";


//Deprecated
export default function Chat({messages, user, error, message, setMessage, handleSendMessage, isSending, header}) {

  return (
    <div className="main">
      <div className="chat-container">
        <div className="opened-chat-banner">{header}</div>
        <div className="opened-chat-box">
          {/* MESSAGES AREA */}
          <div className="chat-messages">
            <ReceiveMessage 
            messages={messages} 
            user={user}
            error={error}/>
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