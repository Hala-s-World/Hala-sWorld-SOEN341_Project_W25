import React, { useState, useEffect } from "react";
import supabase from "../../helper/supabaseClient";
import SupabaseAPI from "../../helper/supabaseAPI";
import { useAuthStore } from "../../store/authStore";
import Chat from "./Chat";

export default function DirectMessaging({ receiverId }) {
  const { user } = useAuthStore();
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState("");
  const [messages, setMessages] = useState([]);

  // Fetch all direct messages between user and selected friend
  useEffect(() => {
    if (!user) return;

    console.log(user.id)

    const fetchMessages = async () => {
      try {
        const data = await SupabaseAPI.getDirectMessages(user.id, receiverId);
        if (data) {
          console.log(data)
          setMessages(data);
        }
      } catch (error) {
        console.log("Error receiving messages:", error);
        setError("There was an error receiving your messages.");
      }
    };

    fetchMessages();

    //subscribe to real time changes on direct messages table
    const subscription = supabase
      .channel("messages")
      .on("postgres_changes", { event: "*", schema: "public", table: "direct_messages" }, fetchMessages)
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [user, receiverId]);

  // Send a direct message

  const handleSendMessage = async (e) => {
    e.preventDefault();
    setIsSending(true);
    setError("");

    try {
      console.log("Sending message:", { senderId: user.id, receiverId, messageText: message });

      const data = await SupabaseAPI.sendDirectMessage(user.id, receiverId, message);

      if (data) {
        console.log("Message sent successfully!");
        setMessage("");
        setMessages((prevMessages) => [...prevMessages, data[0]]);
      }
    } catch (error) {
      console.log("Error sending message:", error);
      setError("There was an error sending your message.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Chat 
      messages={messages}
      message={message} 
      user={user}
      error={error}
      setMessage={setMessage}
      handleSendMessage={handleSendMessage}
      isSending={isSending}/>
  );
}

