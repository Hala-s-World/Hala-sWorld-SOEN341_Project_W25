import React, { useState } from "react";
import "../styles/channelmanager.css";
import supabase from "../../helper/supabaseClient";
import { useAuthStore } from "../../store/authStore";

export default function AddChannel({ onSuccess }) {
    const { user, role } = useAuthStore();
    const isAdmin = role === "admin";
    
    const [formData, setFormData] = useState({
        channel_name: "",
        description: "",
        is_private: !isAdmin
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // 1. First create the channel
            const { data: channelData, error: channelError } = await supabase
                .from("channel")
                .insert([{
                    channel_name: formData.channel_name,
                    description: formData.description,
                    channel_creator_id: user.id,
                    is_private: formData.is_private
                }])
                .select(); // Important: need to return the created channel

            if (channelError) throw channelError;

            // 2. Then add creator to the channel
            const { error: userChannelError } = await supabase
                .from("users_channels")
                .insert([{
                    user_id: user.id,
                    channel_id: channelData[0].id
                }]);

            if (userChannelError) throw userChannelError;

            // Reset form and notify parent
            setFormData({
                channel_name: "",
                description: "",
                is_private: !isAdmin
            });
            
            if (onSuccess) onSuccess();
            
        } catch (error) {
            console.error("Error in channel creation:", error.message);
            alert("Failed to create channel");
        }
    };

    return (
        <div className="AddChannel">
            <form className="add-channel-form" onSubmit={handleSubmit}>
                <label>Channel Name</label>
                <input
                    type="text"
                    name="channel_name"
                    value={formData.channel_name}
                    onChange={handleChange}
                    required
                />

                <label>Description</label>
                <input
                    type="text"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                />

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

                <button type="submit" className="add-channel-button">
                    Add Channel
                </button>
            </form>
        </div>
    );
}