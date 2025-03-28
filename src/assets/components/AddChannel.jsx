import React, { useState } from "react";
import "../styles/channelmanager.css";
import supabase from "../../helper/supabaseClient";

export default function AddChannel() {
    // Form State
    const [formData, setFormData] = useState({
        channel_name: "",
        description: "",
    });

    // Handle Input Changes
    const handleChange = (e) => {
        setFormData({
            ...formData, // Correctly spread previous state
            [e.target.name]: e.target.value,
        });
    };

    // Handle Form Submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Insert data into Supabase "channel" table
        const { data, error } = await supabase.from("channel").insert([
            {
                channel_name: formData.channel_name,
                description: formData.description,
            },
        ]);

        if (error) {
            console.error("Error inserting data: ", error.message);
            //add positive message here
            //close modal
        } else {
            //add negative feedback message here
            console.log("Data inserted successfully: ", data);
            // Reset the form after successful submission
            setFormData({
                channel_name: "",
                description: "",
            });
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
                    id="channel_name"
                    value={formData.channel_name}
                    onChange={handleChange}
                    required
                />

                {/* Channel Description Input */}
                <label>Description</label>
                <input
                    type="text"
                    name="description"
                    id="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                />

                {/* Submit Button */}
                <button type="submit" className="add-channel-button">
                    Add
                </button>
            </form>
        </div>
    );
}
