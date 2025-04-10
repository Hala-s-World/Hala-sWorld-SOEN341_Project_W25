import supabase from "../../helper/supabaseClient";
import { useAuthStore } from "../../store/authStore";
import "../styles/channelmanager.css"


const LeaveChannel = ({channelId, onLeave}) => {

    const { user } = useAuthStore();

    const handleLeave = async () => {
        const confirm = window.confirm("Are you sure you want to leave this channel?");
        if (!confirm) return;

        const { error } = await supabase
            .from("users_channels")
            .delete()
            .match({ user_id: user.id, channel_id: channelId });

        if (error) {
            console.error("Error leaving channel:", error);
            alert("Failed to leave the channel.");
        } else {
            alert("You have left the channel.");
            if (onLeave) onLeave(); // Optional callback, e.g. to redirect or refresh
        }
    };

    return (
        <div className="LeaveChannel">
            <button
                className="leave-channel-button"
                onClick={handleLeave}
            >
                Leave This Channel
            </button>
        </div>
    )
}

export default LeaveChannel;