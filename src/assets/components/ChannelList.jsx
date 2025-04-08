import React, { useEffect, useState } from "react";
import "../styles/channelmanager.css";
import supabase from "../../helper/supabaseClient";
import ChannelCard from "./ChannelCard";
import { useAuthStore } from "../../store/authStore"; // adjust path if needed

export default function ChannelList({onSelectChannel}) {
    const [channels, setChannels] = useState([]);
    const { user, role } = useAuthStore();

    const isAdmin = role === "admin";

    useEffect(() => {
        const fetchChannels = async () => {
            const { data, error } = await supabase.from("channel").select("*");
            if (error) {
                console.error("Error fetching channels:", error);
            } else {
                setChannels(data);
            }
        };

        fetchChannels();
    }, []);

    const joinChannel = async (channelId) => {
        if (!user) {
            alert("You must be logged in to join a channel.");
            return;
        }

        const { error } = await supabase.from("users_channels").insert([
            {
                user_id: user.id,
                channel_id: channelId,
            },
        ]);

        if (error) {
            console.error("Error joining channel:", error);
            alert("Failed to join channel.");
        } else {
            alert("Joined successfully!");
        }
    };

    const deleteChannel = async (channelId) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this channel?");
        if (!confirmDelete) return;
        const { error } = await supabase.from("channel").delete().eq("id", channelId);
        if (error) {
            console.error("Error deleting channel:", error);
            alert("Failed to delete channel.");
        } else {
            setChannels((prev) => prev.filter((c) => c.id !== channelId));
        }
    };

    return (
        <div className="ChannelList">
            {channels.map((channel) => (
                <ChannelCard
                    key={channel.id}
                    channelName={channel.channel_name}
                    onJoin={() => joinChannel(channel.id)}
                    onDelete={() => deleteChannel(channel.id)}
                    isAdmin={isAdmin}
                    onClick={() => onSelectChannel(channel)} // select which channel Chat to show
                />
            ))}
        </div>
    );
}
