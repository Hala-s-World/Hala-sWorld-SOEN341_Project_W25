import "../assets/styles/FriendsPage.css";
import SupabaseAPI from "../helper/supabaseAPI";
import { useAuthStore } from "../store/authStore";
import FriendCard from "../assets/components/FriendCard";
import { useState, useEffect } from "react";
import supabase from "../helper/supabaseClient"; // Import your Supabase client

const FriendsPage = () => {
  const { user } = useAuthStore();
  const [setError] = useState("");
  const [friends, setFriends] = useState([]);

  useEffect(() => {
    if (user) {
      const fetchFriends = async () => {
        try {
          const data = await SupabaseAPI.getFriends(user.id);
          if (data) {
            setFriends(data);
          }
        } catch (error) {
          console.log("Error receiving friends:", error);
          setError("There was an error receiving your friends.");
        }
      };

      fetchFriends();

      const subscription = supabase
        .channel("friends")
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "friends" },
          fetchFriends
        )
        .subscribe();

      return () => {
        subscription.unsubscribe();
      };
    }
  }, [user]);

  return (
    <div className="main">
      <div className="chat-container">
        <div className="opened-chat-banner">YOUR FRIENDS</div>
        <div className="opened-chat-box">
          <div className="friends-list">
            {friends.map((friend) => {
              const friendId =
                user.id === friend.user_id ? friend.friend_id : friend.user_id;
              const friendName =
                user.id === friend.user_id
                  ? friend.friend.username
                  : friend.user.username;

              return (
                <FriendCard
                  key={friendId}
                  friendId={friendId}
                  friendName={friendName}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FriendsPage;
