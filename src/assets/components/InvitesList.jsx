import { useEffect, useState } from "react";
import supabase from "../../helper/supabaseClient";
import { useAuthStore } from "../../store/authStore";
import ChannelInvitation from "./ChannelInvitation"; // Component for Channel Invitations
import FriendRequest from "./FriendRequest"; // Component for Friend Requests
import "../styles/channelmanager.css";

const InvitesList = () => {
  const [channelInvites, setChannelInvites] = useState([]); // Store channel invites
  const [friendRequests, setFriendRequests] = useState([]); // Store friend requests
  const { user } = useAuthStore();

  useEffect(() => {
    const fetchInvites = async () => {
      if (!user?.id) return;

      // Fetch pending channel invitations
      const { data: channelInvitesData, error: channelInviteError } =
        await supabase
          .from("channel_invitations")
          .select("*")
          .eq("recipient_id", user.id)
          .eq("status", "pending");

      if (channelInviteError) {
        console.error("Error fetching channel invites:", channelInviteError);
      } else {
        console.log("Fetched channel invites:", channelInvitesData); // Debugging
        setChannelInvites(channelInvitesData || []); // Replace the current state
      }

      // Fetch pending friend requests
      const { data: friendRequestsData, error: friendRequestError } =
        await supabase
          .from("friendrequests")
          .select("*")
          .eq("recipient_id", user.id)
          .eq("status", "pending");

      if (friendRequestError) {
        console.error("Error fetching friend requests:", friendRequestError);
      } else {
        console.log("Fetched friend requests:", friendRequestsData); // Debugging
        setFriendRequests(friendRequestsData || []); // Replace the current state
      }
    };

    fetchInvites();
  }, [user?.id]); // Only re-run when user.id changes

  const handleRemoveInvite = (inviteId) => {
    setChannelInvites((prev) => prev.filter((inv) => inv.id !== inviteId));
  };

  const handleRemoveFriendRequest = (requestId) => {
    setFriendRequests((prev) => prev.filter((req) => req.id !== requestId));
  };

  return (
    <div className="InvitesList">
      <h3>Invitations</h3>

      {/* Channel Invitations */}
      <div className="section-header">
        <h4>Channel Invitations</h4>
      </div>
      {channelInvites.length === 0 ? (
        <p>No pending channel invitations.</p>
      ) : (
        channelInvites.map((invite) => (
          <ChannelInvitation
            key={invite.id}
            invite={invite}
            onRemove={handleRemoveInvite}
          />
        ))
      )}

      {/* Friend Requests */}
      <div className="section-header">
        <h4>Friend Requests</h4>
      </div>
      {friendRequests.length === 0 ? (
        <p>No pending friend requests.</p>
      ) : (
        friendRequests.map((request) => (
          <FriendRequest
            key={request.id}
            request={request}
            onRemove={handleRemoveFriendRequest}
          />
        ))
      )}
    </div>
  );
};

export default InvitesList;
