import React, { useState, useEffect, useRef } from "react";
import supabase from "../../helper/supabaseClient";
import SupabaseAPI from "../../helper/supabaseAPI";


const ReceiveMessage = ({ receiverId }) => {
    const [messages, setMessages] = useState([]); 
    const [user, setUser] = useState(null); 
    const [error, setError] = useState('');
    const messagesEndRef = useRef(null);

    const getCurrentUser = async () => {
        const { data, error } = await supabase.auth.getUser();
        if (error) {
            console.error("Error fetching user:", error.message);
        } else {
            setUser(data.user);
        }
    };

    useEffect(() => {
        getCurrentUser();
    }, []);

    useEffect(() => {
        if (!user) return;

        const fetchMessages = async () => {
            try {
                const data = await SupabaseAPI.getDirectMessages(user.id, receiverId);
                if (data) {
                    setMessages(data); 
                }
            } catch (error) {
                console.log("Error receiving messages:", error);
                setError("There was an error receiving your messages.");
            }
        };

        fetchMessages();

    const subscription = supabase
            .channel("messages")
            .on("postgres_changes", { event: "*", schema: "public", table: "direct_messages" }, fetchMessages)
            .subscribe();

        return () => {
            subscription.unsubscribe();
        };
    }, [user, receiverId]);

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
                            <div className="chat-name">{msg.sender_id === user.id ? "You" : "Other"}</div>
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
