import React, { useEffect, useState } from "react";
import "../styles/channelmanager.css";
import supabase from "../../helper/supabaseClient";
import ChannelCard from "./ChannelCard";

export default function ChannelList() {
    // State to store fetched channels
    const [channels, setChannels] = useState([]);

    // Fetch channels when the component mounts
    useEffect(() => {
        const fetchChannels = async () => {
            // Fetch all channels from the "channel" table
            const { data, error } = await supabase.from("channel").select("*");

            if (error) {
                console.error("Error fetching channels:", error);
            } else {
                // Store the fetched channels in the state
                setChannels(data);
            }
        };

        fetchChannels();
    }, []);

    return (
        <div className="ChannelList">
            {/* Map over the channels and render a ChannelCard for each */}
            {channels.map((channel) => (
                <ChannelCard
                    key={channel.id} // Use a unique key for each card
                    channelName={channel.channel_name} // Pass channel_name to ChannelCard
                />
            ))}
        </div>
    );
};
