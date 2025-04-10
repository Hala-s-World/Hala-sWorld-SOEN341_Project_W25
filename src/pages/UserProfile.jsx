import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import supabase from "../helper/supabaseClient";
import SupabaseAPI from "../helper/supabaseAPI";
import "../assets/styles/UserProfile.css";
import { useAuthStore } from "../store/authStore";

const DEFAULT_AVATAR =
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTZ0FpBg5Myb9CQ-bQpFou9BY9JXoRG6208_Q&s";

function UserProfile() {
  const { id } = useParams();
  const { user } = useAuthStore();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [friendStatus, setFriendStatus] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ full_name: "", bio: "" });

  const isOwnProfile = user?.id === id;

  // Fetch Profile and Friendship Status
  useEffect(() => {
    const fetchProfile = async () => {
      const { data, error } = await supabase
        .from("user_profiles")
        .select("full_name, username, bio, avatar")
        .eq("id", id)
        .single();

      if (!error) {
        setProfile(data);
        setFormData({
          full_name: data.full_name || "",
          bio: data.bio || "",
        });
      }
      setLoading(false);
    };

    const checkFriendship = async () => {
      if (!user || !id || user.id === id) return;

      // Check if a friendship exists in the "friends" table
      const { data, error } = await supabase
        .from("friends")
        .select()
        .or(
          `and(user_id.eq.${user.id},friend_id.eq.${id}),and(user_id.eq.${id},friend_id.eq.${user.id})`
        );

      if (error) {
        console.error("Error checking friendship:", error.message);
        return;
      }

      if (data.length > 0) {
        // If a friendship exists, set the status to "friends"
        setFriendStatus("friends");
      } else {
        // If no friendship exists, check for pending requests in the "friendrequests" table
        const { data: requestData, error: requestError } = await supabase
          .from("friendrequests")
          .select()
          .or(
            `and(sender_id.eq.${user.id},recipient_id.eq.${id}),and(sender_id.eq.${id},recipient_id.eq.${user.id})`
          );

        if (requestError) {
          console.error("Error checking friend requests:", requestError.message);
          return;
        }

        if (requestData.length > 0) {
          const entry = requestData.find(
            (f) =>
              (f.sender_id === user.id && f.recipient_id === id) ||
              (f.sender_id === id && f.recipient_id === user.id)
          );
          if (entry?.status === "pending") {
            if (entry.sender_id === user.id) setFriendStatus("request_sent");
            else setFriendStatus("incoming_request");
          }
        } else {
          setFriendStatus("none");
        }
      }
    };

    fetchProfile();
    checkFriendship();
  }, [id, user]);

  const sendFriendRequest = async () => {
    const { error } = await supabase
      .from("friendrequests")
      .insert([{ sender_id: user.id, recipient_id: id, status: "pending" }]);
    if (!error) setFriendStatus("request_sent");
  };

  const cancelRequest = async () => {
    await supabase
      .from("friendrequests")
      .delete()
      .match({ sender_id: user.id, recipient_id: id, status: "pending" });
    setFriendStatus("none");
  };

  const unfriend = async () => {
    await SupabaseAPI.deleteFriend(user.id, id);
    setFriendStatus("none");
  };

  const handleEdit = () => setIsEditing(true);
  const handleCancel = () => setIsEditing(false);

  const handleSave = async () => {
    const { error } = await supabase
      .from("user_profiles")
      .update(formData)
      .eq("id", user.id);

    if (!error) {
      setProfile((prev) => ({ ...prev, ...formData }));
      setIsEditing(false);
    }
  };

  if (loading) return <div className="profile-container">Loading...</div>;
  if (!profile) return <div className="profile-container">User not found.</div>;

  return (
    <div className="profile-container">
      <img
        src={profile.avatar || DEFAULT_AVATAR}
        alt="Profile Avatar"
        className="profile-avatar"
      />
      {isEditing ? (
        <>
          <input
            className="profile-edit-input"
            value={formData.full_name}
            onChange={(e) =>
              setFormData({ ...formData, full_name: e.target.value })
            }
          />
          <textarea
            className="profile-edit-textarea"
            value={formData.bio}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
          />
          <button onClick={handleSave}>Save</button>
          <button onClick={handleCancel}>Cancel</button>
        </>
      ) : (
        <>
          <h2>{profile.full_name}</h2>
          <p className="username">@{profile.username}</p>
          <p className="bio">{profile.bio || "No bio available."}</p>
          {isOwnProfile && <button onClick={handleEdit}>Edit Profile</button>}
        </>
      )}

      {!isOwnProfile && (
        <div className="friend-actions">
          {friendStatus === "friends" && (
            <button onClick={unfriend}>Unfriend</button>
          )}
          {friendStatus === "request_sent" && (
            <button onClick={cancelRequest}>Cancel Request</button>
          )}
          {friendStatus === "incoming_request" && (
            <button onClick={acceptFriendRequest}>Accept Request</button>
          )}
          {friendStatus === "none" && (
            <button onClick={sendFriendRequest}>Send Friend Request</button>
          )}
        </div>
      )}
    </div>
  );
}

export default UserProfile;
