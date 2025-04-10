import React from "react";
import "../styles/AddFriendModal.css";
import supabase from "../helper/supabaseClient";
import { useAuthStore } from "../store/authStore";

const AddFriendModal = ({ isOpen, onClose }) => {
  const { user } = useAuthStore();

  const handleAddFriend = async (e) => {
    e.preventDefault();
    const username = e.target.elements.friendUsername.value.trim();
    if (!username || !user) return;

    const { data: targetUser, error: userError } = await supabase
      .from("user_profiles")
      .select("id")
      .eq("username", username)
      .single();

    if (!targetUser || targetUser.id === user.id) {
      alert("Invalid user or cannot add yourself.");
      return;
    }

    const { data: existing } = await supabase
      .from("friends")
      .select("*")
      .or(`user_id.eq.${user.id},friend_id.eq.${targetUser.id}`)
      .eq("friend_id", targetUser.id);

    if (existing.length > 0) {
      alert("Friend request already sent or exists.");
      return;
    }

    const { error } = await supabase.from("friends").insert([
      {
        user_id: user.id,
        friend_id: targetUser.id,
        status: "pending",
      },
    ]);

    if (error) alert("Failed to send request.");
    else alert("Friend request sent!");

    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Add Friend</h2>
        <form onSubmit={handleAddFriend}>
          <input
            type="text"
            name="friendUsername"
            placeholder="Enter username"
            required
          />
          <button type="submit">Add</button>
          <button type="button" onClick={onClose}>
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddFriendModal;
