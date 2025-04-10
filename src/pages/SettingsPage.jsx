import React, { useState, useEffect } from "react";
import supabase from "../helper/supabaseClient";
import SupabaseAPI from "../helper/supabaseAPI"; // Import the updated SupabaseAPI
import { useAuthStore } from "../store/authStore";
import "../assets/styles/settings.css";

function SettingsPage() {
  const { user } = useAuthStore();
  const [fullName, setFullName] = useState("");
  const [bio, setBio] = useState("");
  const [username, setUsername] = useState("");
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);

  // Fetch user profile on component mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profile = await SupabaseAPI.getUserProfile(user.id);
        console.log("Fetched profile:", profile);

        setUsername(profile.username || "");
        setFullName(profile.full_name || "");
        setBio(profile.bio || "");

        if (profile.avatar) {
          // Debug avatar data
          console.log("Avatar data:", profile.avatar);

          // Convert avatar to a preview URL
          const avatarUrl = URL.createObjectURL(
            new Blob([new Uint8Array(profile.avatar)])
          );
          setAvatarPreview(avatarUrl);
        }
      } catch (error) {
        console.error("Error fetching profile:", error.message);
      }
    };

    if (user?.id) {
      fetchProfile();
    }
  }, [user]);

  // Handle Save functionality
  const handleSave = async () => {
    let avatar = null;
    if (avatarFile) {
      avatar = await avatarFile.arrayBuffer();
    }

    const { error } = await supabase.from("profiles").upsert({
      id: user.id,
      username: username,
      full_name: fullName,
      bio,
      avatar: avatar ? new Uint8Array(avatar) : undefined,
    });

    if (error) {
      console.error(error);
    } else {
      alert("Profile updated");
    }
  };

  // Handle file selection and preview
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setAvatarFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarPreview(reader.result); // Set the preview for the selected image
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="sp-settings-page">
      <h2 className="sp-settings-page__header">Settings</h2>

      {/* Avatar section */}
      <div className="sp-avatar-container">
        <img
          className="sp-avatar-preview"
          src={
            avatarPreview ||
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTZ0FpBg5Myb9CQ-bQpFou9BY9JXoRG6208_Q&s" // Default avatar if none selected
          }
          alt="User Avatar"
        />
      </div>

      {/* Username Input */}
      <input
        className="sp-settings-input-text"
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />

      {/* Full Name Input */}
      <input
        className="sp-settings-input-text"
        type="text"
        placeholder="Full Name"
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
      />

      {/* Bio Input */}
      <textarea
        className="sp-settings-input-textarea"
        placeholder="Bio"
        value={bio}
        onChange={(e) => setBio(e.target.value)}
      />

      {/* Avatar File Input */}
      <input
        className="sp-settings-input-file"
        type="file"
        onChange={handleFileChange}
      />

      {/* Save Button */}
      <button
        className="sp-settings-save-btn sp-settings-save-btn--margin-top"
        onClick={handleSave}
      >
        Save
      </button>
    </div>
  );
}

export default SettingsPage;
