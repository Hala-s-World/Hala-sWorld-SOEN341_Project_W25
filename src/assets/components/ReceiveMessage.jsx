import React, { useState, useEffect, useRef } from "react";



const ReceiveMessage = ({ messages, user, error }) => {
    const messagesEndRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, [messages]);

    return (
        <div>
            {error && <div className="text-red-500">{error}</div>} 
            

            {messages.map((msg, index) => (
                <div key={index} className="chat-message">
                    <img
                        className="chat-item-profile-picture"
                        src="https://byuc.wordpress.com/wp-content/uploads/2012/07/avat-2.jpg"
                        alt="User avatar"
                    />
                    <div className="chat-info">
                        <div className="chat-header">
                            <div className="chat-name">{msg.sender_id === user.id ? "You" : msg.receiver.username}</div>
                            <div className="chat-date">{msg.formattedDate}</div>
                        </div>
                        <div className="chat-text">{msg.content}</div>
                        
                    </div>
                    
                </div>
            ))}
            <div ref={messagesEndRef} />
        </div>
    );
};

export default ReceiveMessage;
