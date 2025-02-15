import React, { useState } from "react";
import "../styles/channelmanager.css"
import supabase from "../../helper/supabaseClient";









export default function AddChannel() {
    const [formData, setFormData] = useState({
        channel_name: '',
        description: ''
    });

    const handleChange = (e) => {
        setFormData({ formData, [e.target.name]: e.target.value });
        console.log(formData.channel_name);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const { data, error } = await supabase
            .from("channel")
            .insert([formData]);

        if (error) {
            console.error('Error inserting data: ', error);
            console.log(formData.channel_name)
        } else {
            console.log('Data inserte ', data);
        }
    }





    return (
        <div className="AddChannel">
            <form className="add-channel-form" onSubmit={handleSubmit}>
                <label>Channel Name</label>
                <input type="text" name="channel_name" id="channel_name" onChange={handleChange}></input>
                <label>Description</label>
                <input type="text" name="description" id="description" onChange={handleChange}></input>
                <button type="submit" className="add-channel-button">Add</button>
            </form>
        </div>
    )
}

