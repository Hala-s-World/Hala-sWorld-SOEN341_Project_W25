import { useState } from "react";
import "../styles/channelmanager.css";
import supabase from "../../helper/supabaseClient";
import { useAuthStore } from "../../store/authStore";

function InviteUserModal({ channelId, onClose }) {
    const [email, setEmail] = useState('');
    const { user } = useAuthStore();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);

    const handleInvite = async () => {
        if (!email || !user) return;
        
        setIsSubmitting(true);
        setError(null);
        
        try {
            // 1. Lookup user by email
            const { data: invitedUser, error: findError } = await supabase
                .from('user')
                .select('id')
                .eq('email', email)
                .single();

            if (findError) {
                throw new Error("User lookup failed");
            }

            if (!invitedUser) {
                setError("User not found");
                return;
            }

            // 2. Create invitation
            const { error: inviteError } = await supabase
                .from('channel_invitations')
                .insert([
                    {
                        channel_id: channelId,
                        sender_id: user.id,
                        recipient_id: invitedUser.id
                    }
                ]);

            if (inviteError) {
                throw new Error("Failed to send invitation");
            }

            // Success actions
            alert("User invited to channel!");
            setEmail('');
            onClose();
            
        } catch (error) {
            console.error("Invite failed:", error);
            setError(error.message || "An error occurred");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="invite-user">
            <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="user@example.com"
                disabled={isSubmitting}
            />
            <button 
                onClick={handleInvite}
                disabled={!email || isSubmitting}
            >
                {isSubmitting ? "Sending..." : "Send Invite"}
            </button>
        </div>
    );
}

export default InviteUserModal;