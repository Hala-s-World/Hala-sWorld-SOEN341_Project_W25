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
        console.log("Fetching profile for user ID:", user.id); // Debugging log
        const profile = await SupabaseAPI.getUserProfile(user.id);
        console.log("Fetched profile:", profile);

        setUsername(profile.username || "");
        setFullName(profile.full_name || "");
        setBio(profile.bio || "");

        // Use the avatar_url column to set the avatar preview
        if (profile.avatar_url) {
          console.log("Avatar URL:", profile.avatar_url); // Debugging log
          setAvatarPreview(profile.avatar_url); // Use the URL directly
        } else {
          console.log("No avatar found for user.");
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
    let avatarUrl = avatarPreview; // Default to the current avatar URL

    if (avatarFile) {
      // Upload the avatar to Supabase Storage
      const { data, error: uploadError } = await supabase.storage
        .from("avatars") // Ensure this matches your bucket name
        .upload(`public/${user.id}-${avatarFile.name}`, avatarFile, {
          cacheControl: "3600",
          upsert: true,
        });

      if (uploadError) {
        console.error("Error uploading avatar:", uploadError.message);
        alert("Failed to upload avatar. Please try again.");
        return;
      }

      console.log("Upload response data:", data);

      const filePath = `public/${user.id}-${avatarFile.name}`;
      console.log("File path:", filePath);

      const { data: urlData, error: urlError } = supabase.storage
        .from("avatars")
        .getPublicUrl(filePath);

      if (urlError) {
      console.error("Error getting public URL:", urlError.message);
      alert("Failed to retrieve avatar URL. Please try again.");
      return;
      }

      console.log("Generated public URL:", urlData.publicUrl);
      avatarUrl = urlData.publicUrl; // Use the public URL for the avatar

    }

    // Save the profile data, including the avatar URL, in the database
    const { error } = await supabase.from("profiles").upsert({
      id: user.id,
      username: username,
      full_name: fullName,
      bio,
      avatar_url: avatarUrl, // Save the URL in the new column
    });

    if (error) {
      console.error("Error saving profile:", error.message);
      alert("Failed to save profile. Please try again.");
    } else {
      alert("Profile updated successfully!");
      setAvatarPreview(avatarUrl); // Update the preview with the new avatar URL
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
