import React, { useState } from "react";
import "../styles/channelmanager.css";
import supabase from "../../helper/supabaseClient";
import { useAuthStore } from "../../store/authStore";

export default function AddChannel({ onSuccess }) {
    const { user, role } = useAuthStore();
    const isAdmin = role === "admin";
    
    // Form State
    const [formData, setFormData] = useState({
        channel_name: "",
        description: "",
        is_private: !isAdmin // Default to private for regular users
    });

    // Handle Input Changes
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : value,
        });
    };

    // Handle Form Submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // Insert data into Supabase "channel" table
            const { data, error } = await supabase.from("channel").insert([
                {
                    channel_name: formData.channel_name,
                    description: formData.description,
                    channel_creator_id: user.id,
                    is_private: formData.is_private
                },
            ]).select();

            if (error) throw error;

            // Add creator to the channel automatically
            await supabase.from("users_channels").insert([
                {
                    user_id: user.id,
                    channel_id: data[0].id,
                }
            ]);

            // Reset form and notify parent
            setFormData({
                channel_name: "",
                description: "",
                is_private: !isAdmin
            });
            
            if (onSuccess) onSuccess();
            
        } catch (error) {
            console.error("Error creating channel:", error.message);
            alert("Failed to create channel");
        }
    };

    return (
        <div className="AddChannel">
            <form className="add-channel-form" onSubmit={handleSubmit}>
                {/* Channel Name Input */}
                <label>Channel Name</label>
                <input
                    type="text"
                    name="channel_name"
                    value={formData.channel_name}
                    onChange={handleChange}
                    required
                />

                {/* Channel Description Input */}
                <label>Description</label>
                <input
                    type="text"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                />

                {/* Private Channel Checkbox (only for admins) */}
                {isAdmin && (
                    <div className="checkbox-container">
                        <label>
                            <input
                                type="checkbox"
                                name="is_private"
                                checked={formData.is_private}
                                onChange={handleChange}
                            />
                            Private Channel
                        </label>
                    </div>
                )}

                {/* Submit Button */}
                <button type="submit" className="add-channel-button">
                    Add Channel
                </button>
            </form>
        </div>
    );
}