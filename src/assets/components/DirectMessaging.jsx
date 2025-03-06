import supabase from "../../helper/supabaseClient";
import SupabaseAPI from "../../helper/supabaseAPI";
import React, { useState, useEffect, useRef } from "react";

export default function DirectMessaging(){


//  receive message portion
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

//  send message portion
const handleSendMessage = async (e) => {
  e.preventDefault();
  setIsSending(true);
  setError('');

  try {
      console.log("Sending message:", { senderId: user.id, receiverId, messageText: message });

      const data = await SupabaseAPI.sendDirectMessage(user.id, receiverId, message);

      if (data) {
        console.log('Message sent successfully!');
        setMessage(''); 
        onMessageSent(data[0]); 
      }
      } catch (error) {
        console.log('Error sending message:', error);
        setError('There was an error sending your message.');
      } finally {
        setIsSending(false);
        
      }
    };
}

