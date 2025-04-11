import React, { useEffect, useState } from "react";
import supabase from "../../helper/supabaseClient";
import { useAuthStore } from "../../store/authStore";
import "../styles/channelmanager.css";

const FriendRequest = ({ request, onRemove }) => {
  const { user } = useAuthStore(); // Correctly using the auth store
  const [friendProfile, setFriendProfile] = useState({ username: "", avatar_url: "" });

  // Fetch the friend's profile (username and avatar) from the "profiles" table
  useEffect(() => {
    const fetchFriendProfile = async () => {
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("username, avatar_url")
          .eq("id", request.sender_id)
          .single();

        if (error) {
          console.error("Error fetching friend's profile:", error);
          return;
        }

        setFriendProfile(data);
      } catch (error) {
        console.error("Unexpected error fetching friend's profile:", error);
      }
    };

    fetchFriendProfile();
  }, [request.sender_id]);

  const handleAccept = async () => {
    try {
      // Step 1: Delete the friend request from "friendrequests" table
      const { error: deleteRequestError } = await supabase
        .from("friendrequests")
        .delete()
        .eq("id", request.id);

      if (deleteRequestError) {
        console.error(
          "Error deleting the request from friendrequests:",
          deleteRequestError
        );
        alert("There was an error processing your request. Please try again.");
        return;
      }

      // Step 2: Insert into "friends" table (creating two entries for mutual friendship)
      const { error: insertError } = await supabase.from("friends").upsert([
        {
          user_id: user.id,
          friend_id: request.sender_id, // Current user becomes friends with the sender
          created_at: new Date(),
        },
      ]);

      if (insertError) {
        console.error("Error inserting into friends table:", insertError);
        alert(
          "There was an error confirming the friendship. Please try again."
        );
        return;
      }

      // Step 3: Remove the request from the UI
      onRemove(request.id);

      // Step 4: Notify the user that the friendship has been established
      alert("Friend request accepted! You are now friends.");
    } catch (error) {
      console.error("Error accepting the friend request:", error);
      alert("An unexpected error occurred. Please try again.");
    }
  };

  const handleReject = async () => {
    try {
      // Step 1: Remove the request from the "friendrequests" table
      const { error } = await supabase
        .from("friendrequests")
        .delete()
        .eq("id", request.id);

      if (error) {
        console.error("Error rejecting friend request:", error);
        alert(
          "There was an error processing your rejection. Please try again."
        );
        return;
      }

      // Step 2: Remove the request from the UI
      onRemove(request.id);

      // Step 3: Notify the user that the request was rejected
      alert("Friend request rejected.");
    } catch (error) {
      console.error("Error rejecting the friend request:", error);
      alert("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <div className="Invitation">
      <div className="friend-info">
        <img
          src={friendProfile.avatar_url || "/default-avatar.png"}
          alt={`${friendProfile.username}'s avatar`}
          className="sender-avatar"
        />
        <p>Friend request from {friendProfile.username || "Loading..."}</p>
      </div>
      <div className="actions">
        <button onClick={handleAccept} className="accept-btn">
          Accept
        </button>
        <button onClick={handleReject} className="reject-btn">
          Reject
        </button>
      </div>
    </div>
  );
};

export default FriendRequest;
