import { useEffect, useState } from "react";
import ChannelInvitation from "./ChannelInvitation";
import supabase from "../../helper/supabaseClient";
import { useAuthStore } from "../../store/authStore";
import "../styles/channelmanager.css"

const InvitesList = () => {
    const [invites, setInvites] = useState([]);
    const { user } = useAuthStore();

    useEffect(() => {
        const fetchInvites = async () => {
            const { data, error } = await supabase
                .from("channel_invitations")
                .select("*")
                .eq("recipient_id", user.id)
                .eq("status", "pending"); // optional: only show pending invites

            if (error) {
                console.error("Error fetching invites:", error);
            } else {
                setInvites(data);
            }
        };

        if (user?.id) {
            fetchInvites();
        }
    }, [user]);

    const handleRemoveInvite = (inviteId) => {
        setInvites(prev => prev.filter(inv => inv.id !== inviteId));
    };

    return (
        <div className="InvitesList">
            <h3>Channel Invites</h3>
            {invites.length === 0 ? (
                <p>No pending invitations.</p>
            ) : (
                invites.map(invite => (
                    <ChannelInvitation key={invite.id} invite={invite} onRemove={handleRemoveInvite} />
                ))
            )}
        </div>
    );
};

export default InvitesList;
