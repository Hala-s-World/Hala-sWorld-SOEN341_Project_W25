import  { useState, useEffect } from "react";
import supabase from "../../helper/supabaseClient";
import SupabaseAPI from "../../helper/supabaseAPI";
import { useAuthStore } from "../../store/authStore";
import Chat from "./Chat";

export default function DirectMessaging() {
  const { user, currentFriend } = useAuthStore();
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState("");
  const [messages, setMessages] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [friendStatus, setFriendStatus] = useState("offline");

  let {friendId, friendName} = currentFriend;

  // Fetch all direct messages between user and selected friend
  useEffect(() => {
    if (!user) return;

    const fetchMessages = async () => {
      try {
        const data = await SupabaseAPI.getDirectMessages(user.id, friendId);
        if (data) {
          setMessages(data);
        }
      } catch (error) {
        console.log("Error receiving messages:", error);
        setError("There was an error receiving your messages.");
      }
    };

    //fetch status of friend
    const fetchStatus = async () => {
      try {
          const { data } = await SupabaseAPI.getUserStatus(friendId);
          setFriendStatus(data?.status ?? "offline");
      } catch (error) {
          console.error("Error fetching user status:", error);
          setFriendStatus("offline");
      } finally {
          setIsLoaded(true);
      }
    };

    fetchStatus();
    fetchMessages();

    const channel = SupabaseAPI.subscribeToFriendStatus(friendId, setFriendStatus);

    //subscribe to real time changes on direct messages table
    const subscription = supabase
      .channel("messages")
      .on("postgres_changes", { event: "*", schema: "public", table: "direct_messages" }, fetchMessages)
      .subscribe();

    return () => {
      subscription.unsubscribe();
      SupabaseAPI.unsubscribeFromUserStatus(channel);
    };
  }, [user, friendId]);

  // Send a direct message

  const handleSendMessage = async (e) => {
    e.preventDefault();
    setIsSending(true);
    setError("");

    try {
      console.log("Sending message:", { senderId: user.id, friendId, messageText: message });

      const data = await SupabaseAPI.sendDirectMessage(user.id, friendId, message);

      if (data) {
        console.log("Message sent successfully!");
        setMessage("");
        setMessages((prevMessages) => [...prevMessages, data[0]]);
      }

      // Increment unread messages count if friend is offline
      if(friendStatus === "offline"){
        await SupabaseAPI.IncrementUnreadMessagesCount(user.id, friendId);

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
      isSending={isSending}
      header={friendName}/>
  );
}

