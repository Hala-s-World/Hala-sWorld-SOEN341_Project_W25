import { useState } from "react";
import supabase from "../../helper/supabaseClient";
import "../styles/channelmanager.css"
import SupabaseAPI from "../../helper/supabaseAPI";
import { useAuthStore } from "../../store/authStore";

const ChannelInvitation = ({ invite, onRemove }) => {

    const [channelName, setChannelName] = useState("...")
    const {user} = useAuthStore();

    const fetchChannelName = async () => {
        const { data, error } = await supabase
            .from("channel")
            .select("channel_name")
            .eq("id", invite.channel_id)
            .single();

        if (error) {
            console.error("Failed to fetch channel name:", error);
            setChannelName("Unknown Channel");
        } else {
            setChannelName(data.channel_name);
        }
    };

    if (invite.channel_id) {
        fetchChannelName();
    }

    const handleAccept = async () => {
        const { error } = await supabase
            .from("channel_invitations")
            .update({ status: "accepted" })
            .eq("id", invite.id);
        if (error) {
            console.error("Accept error:", error);
        } else {
            alert(`Accepted invite to channel ${channelName}`);
            onRemove(invite.id); // Remove from list
        }

        const {error1} = await supabase
        .from("users_channels")
        .insert([{
            user_id: invite.recipient_id,
            channel_id: invite.channel_id,
            added_by: invite.sender_id
        }])
    };

    const handleReject = async () => {
        const { error } = await supabase
            .from("channel_invitations")
            .update({ status: "rejected" })
            .eq("id", invite.id);

        if (error) {
            console.error("Reject error:", error);
        } else {
            alert(`Rejected invite to channel ${channelName}`);
            onRemove(invite.id); // Remove from list
        }
    };

    return (
        <div className="ChannelInvitation">
            <p>Invite to join {channelName}</p>
            <button onClick={handleAccept}>Accept</button>
            <button onClick={handleReject} style={{ marginLeft: "10px" }}>
                Reject
            </button>
        </div>
    );
};

export default ChannelInvitation;
