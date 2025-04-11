import { FaArrowLeft } from "react-icons/fa";
import "../styles/dashboard.css";
import "../styles/channelmanager.css";
import SendMessage from "./SendMessage";
import { useState, useEffect } from "react";
import ReceiveMessage from "./ReceiveMessage";
import { useAuthStore } from "../../store/authStore";
import supabase from "../../helper/supabaseClient";
import InviteUserModal from "./InviteUserModal";
import LeaveChannel from "./LeaveChannel";

const ChannelChat = ({ channel, onBack }) => {
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuthStore();
  const [isCreator, setIsCreator] = useState(false);

  // Check if the user is the creator of the channel
  useEffect(() => {
    if (user && channel) {
      setIsCreator(user.id === channel.channel_creator_id);
    }
  }, [user, channel]);

  // Fetch messages and sender profiles separately
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setLoading(true);

        // Step 1: Fetch messages for this channel
        const { data: messages, error: messagesError } = await supabase
          .from("channel_messages")
          .select("*")
          .eq("channel_id", channel.id)
          .order("created_at", { ascending: true });

        if (messagesError) throw new Error(messagesError.message);

        // Step 2: Extract unique sender IDs
        const senderIds = [...new Set(messages.map((msg) => msg.sender_id))];

        // Step 3: Fetch sender profiles
        const { data: profiles, error: profilesError } = await supabase
          .from("profiles")
          .select("id, username")
          .in("id", senderIds);

        if (profilesError) throw new Error(profilesError.message);

        // Step 4: Merge messages with sender profiles
        const formattedMessages = messages.map((msg) => {
          const sender = profiles.find((profile) => profile.id === msg.sender_id);
          return {
            ...msg,
            formattedDate: new Date(msg.created_at).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            }),
            sender: {
              id: msg.sender_id,
              username: sender?.username || "Unknown",
            },
          };
        });

        setMessages(formattedMessages);
      } catch (err) {
        console.error("Error fetching messages:", err);
        setError("Failed to load messages");
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();

    // Set up real-time subscription
    const subscription = supabase
      .channel(`channel_messages:channel_id=eq.${channel.id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "channel_messages",
          filter: `channel_id=eq.${channel.id}`,
        },
        (payload) => {
          const newMessage = {
            ...payload.new,
            formattedDate: new Date(payload.new.created_at).toLocaleTimeString(
              [],
              { hour: "2-digit", minute: "2-digit", hour12: true }
            ),
            sender: {
              id: payload.new.sender_id,
              username: "Unknown", // Default until fetched
            },
          };

          // Prevent duplicate messages
          setMessages((prev) => {
            const isDuplicate = prev.some((msg) => msg.id === newMessage.id);
            if (!isDuplicate) {
              return [...prev, newMessage];
            }
            return prev;
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [channel.id]);

  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!message.trim()) return;

    setIsSending(true);

    // Create optimistic update
    const optimisticMessage = {
      id: `temp-${Date.now()}`, // Temporary ID to prevent conflicts
      sender_id: user.id,
      channel_id: channel.id,
      content: message,
      created_at: new Date().toISOString(), // UTC timestamp
      formattedDate: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }), // Local timezone
      sender: {
        id: user.id,
        username: user.username || "You",
      },
    };

    // Add to local state immediately
    setMessages((prev) => [...prev, optimisticMessage]);
    setMessage(""); // Clear input

    // Then send to server
    const { data, error } = await supabase
      .from("channel_messages")
      .insert([
        {
          sender_id: user.id,
          channel_id: channel.id,
          content: message,
        },
      ])
      .select();

    if (error) {
      console.error("Error sending message:", error);
      setError("Failed to send message");
      // Remove the optimistic update if failed
      setMessages((prev) => prev.filter((msg) => msg.id !== optimisticMessage.id));
    } else {
      // Replace the optimistic message with the actual message from the server
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === optimisticMessage.id
            ? {
                ...data[0],
                formattedDate: new Date(data[0].created_at).toLocaleTimeString(
                  [],
                  { hour: "2-digit", minute: "2-digit" }
                ),
                sender: {
                  id: data[0].sender_id,
                  username: user.username || "You",
                },
              }
            : msg
        )
      );
    }

    setIsSending(false);
  };

  const handleMessageDelete = (messageId) => {
    setMessages((prev) => prev.filter((msg) => msg.id !== messageId));
  };

  return (
    <div className="ChannelChat">
      <button className="back-button" onClick={onBack}>
        <FaArrowLeft />
      </button>
      <div className="opened-chat-banner">
        {isCreator && (
          <InviteUserModal channelId={channel.id} onClose={() => {}} />
        )}
        {!isCreator && <LeaveChannel channelId={channel.id} onLeave={onBack} />}
      </div>
      <div className="opened-chat-box">
        <div className="chat-messages">
          {loading ? (
            <div>Loading messages...</div>
          ) : (
            <ReceiveMessage
              messages={messages}
              user={user}
              error={error}
              onMessageDelete={handleMessageDelete}
            />
          )}
        </div>
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
  );
};

export default ChannelChat;