import React, { useState, useEffect } from "react";
import supabase from "../../helper/supabaseClient";
import SupabaseAPI from "../../helper/supabaseAPI";
import { useAuthStore } from "../../store/authStore";
import Chat from "./Chat";

export default function ChannelMessaging({ channelId }) {
  const { user } = useAuthStore();
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState("");
  const [messages, setMessages] = useState([]);
  const [isMember, setIsMember] = useState(false);

  // Check if the user is a member of the channel
  useEffect(() => {
    if (!user || !channelId) return;

    const checkMembership = async () => {
      const member = await SupabaseAPI.isUserInChannel(user.id, channelId);
      setIsMember(member);
    };

    checkMembership();
  }, [user, channelId]);

  //Fetch all messages for the selected channel
  useEffect(() => {
    if (!user || !channelId) return;

    console.log("Fetching messages for channel:", channelId);

    const fetchMessages = async () => {
      try {
        const data = await SupabaseAPI.getChannelMessages(channelId);
        if (data) {
          console.log("Fetched messages:", data);
          setMessages(data);
        }
      } catch (error) {
        console.log("Error receiving messages:", error);
        setError("There was an error receiving channel messages.");
      }
    };

    fetchMessages();

    // Subscribe to real-time updates
    const subscription = supabase
      .channel(`channel-${channelId}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "channel_messages" }, fetchMessages)
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [user, channelId]);

  //Send a message to the channel
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    if (!isMember) {
      setError("You are not a member of this channel.");
      return;
    }

    setIsSending(true);
    setError("");

    try {
      console.log("Sending message to channel:", { senderId: user.id, channelId, messageText: message });

      const data = await SupabaseAPI.sendChannelMessage(user.id, channelId, message);

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

  if (!isMember) {
    return <div className="text-red-500">You are not a member of this channel.</div>;
  }

  return (
    <Chat 
      messages={messages}
      message={message}
      user={user}
      error={error}
      setMessage={setMessage}
      handleSendMessage={handleSendMessage}
      isSending={isSending}
    />
  );
}
