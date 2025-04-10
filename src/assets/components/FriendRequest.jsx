import React from "react";
import supabase from "../../helper/supabaseClient";
import { useAuthStore } from "../../store/authStore";
import "../styles/channelmanager.css";

const FriendRequest = ({ request, onRemove }) => {
  const { user } = useAuthStore(); // Correctly using the auth store

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
        {
          user_id: request.sender_id, // The sender becomes friends with the current user
          friend_id: user.id,
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
    <div className="FriendRequest">
      <p>Friend request from {request.sender_username}</p>
      <button onClick={handleAccept} className="accept-btn">
        Accept
      </button>
      <button onClick={handleReject} className="reject-btn">
        Reject
      </button>
    </div>
  );
};

export default FriendRequest;
