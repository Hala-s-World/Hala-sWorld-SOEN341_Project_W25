import React, { useEffect, useState } from "react";
import "../styles/channelmanager.css";
import supabase from "../../helper/supabaseClient";
import ChannelCard from "./ChannelCard";
import { useAuthStore } from "../../store/authStore";

export default function ChannelList({ onSelectChannel }) {
    const [channels, setChannels] = useState([]);
    const [userChannels, setUserChannels] = useState([]);
    const { user, role } = useAuthStore();
    
    const isAdmin = role === "admin";

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch all channels (we'll filter them later)
                const { data: channelsData, error: channelsError } = await supabase
                    .from("channel")
                    .select("*");

                if (channelsError) throw channelsError;

                // For "user" fetch the channels they're part of
                if (!isAdmin && user) {
                    const { data: userChannelsData, error: userChannelsError } = await supabase
                        .from("users_channels")
                        .select("channel_id")
                        .eq("user_id", user.id);

                    if (userChannelsError) throw userChannelsError;

                    setUserChannels(userChannelsData.map(uc => uc.channel_id));
                }

                setChannels(channelsData);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, [isAdmin, user]);

    const joinChannel = async (channelId) => {
        if (!user) {
            alert("You must be logged in to join a channel.");
            return;
        }

        try {
            const { error } = await supabase.from("users_channels").insert([
                {
                    user_id: user.id,
                    channel_id: channelId,
                },
            ]);

            if (error) throw error;

            //update user channels after joinin
            setUserChannels(prev => [...prev, channelId]);
            alert("Joined successfully!");
        } catch (error) {
            console.error("Error joining channel:", error);
            alert("Failed to join channel.");
        }
    };

    const deleteChannel = async (channelId) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this channel?");
        if (!confirmDelete) return;

        try {
            const { error } = await supabase.from("channel").delete().eq("id", channelId);
            if (error) throw error;

            setChannels(prev => prev.filter(c => c.id !== channelId));
        } catch (error) {
            console.error("Error deleting channel:", error);
            alert("Failed to delete channel.");
        }
    };

    // Filter channels based on user role and membership
    const filteredChannels = isAdmin
        ? channels
        : channels.filter(channel =>
            !channel.is_private ||
            userChannels.includes(channel.id)
        );

        console.log("user: ", user, "filtered channels: ", filteredChannels, userChannels)
    return (
        <div className="ChannelList">
            {filteredChannels.map((channel) => (
                <ChannelCard
                    key={channel.id}
                    channelName={channel.channel_name}
                    onJoin={() => joinChannel(channel.id)}
                    onDelete={() => deleteChannel(channel.id)}
                    isAdmin={isAdmin}
                    onClick={() => onSelectChannel(channel)}
                    isPrivate={channel.is_private}
                    isMember={filteredChannels.includes(user.id)}
                    isCreator={channel.channel_creator === user?.id}
                    channelId={channel.id}
                    onUserAdded={() => refreshChannelMembers(channel.id)} 
                />
            ))}
        </div>
    );
}