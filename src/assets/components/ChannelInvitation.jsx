import { useEffect, useState } from "react";
import FriendRequest from "./FriendRequest"; // Importing FriendRequest component
import ChannelInvitation from "./ChannelInvitation";
import supabase from "../../helper/supabaseClient";
import { useAuthStore } from "../../store/authStore";
import "../styles/channelmanager.css";

const InvitesList = () => {
  const [invites, setInvites] = useState([]);
  const { user } = useAuthStore();

  // Fetching pending channel invites and friend requests
  useEffect(() => {
    const fetchInvites = async () => {
      // Fetch channel invitations for the user
      const { data, error } = await supabase
        .from("channel_invitations")
        .select("*")
        .eq("recipient_id", user.id)
        .eq("status", "pending"); // Only show pending invites

      if (error) {
        console.error("Error fetching channel invites:", error);
      } else {
        setInvites(data);
      }

      // Fetch pending friend requests for the user
      const { data: friendRequests, error: friendRequestError } = await supabase
        .from("friends")
        .select("*")
        .eq("friend_id", user.id)
        .eq("status", "pending"); // Friend requests to this user

      if (friendRequestError) {
        console.error("Error fetching friend requests:", friendRequestError);
      } else {
        // Add friend requests to the invites list
        const formattedFriendRequests = friendRequests.map((req) => ({
          ...req,
          friend_request: true, // Mark this entry as a friend request
          sender_id: req.user_id, // The sender of the friend request
          recipient_id: req.friend_id, // The recipient is the user who is logged in
          type: "friend_request", // Mark the type as friend_request
        }));

        setInvites((prevInvites) => [
          ...prevInvites,
          ...formattedFriendRequests,
        ]);
      }
    };

    if (user?.id) {
      fetchInvites();
    }
  }, [user]);

  const handleRemoveInvite = (inviteId) => {
    setInvites((prev) => prev.filter((inv) => inv.id !== inviteId));
  };

  return (
    <div className="InvitesList">
      <h3>Invitations</h3>
      {invites.length === 0 ? (
        <p>No pending invitations.</p>
      ) : (
        invites.map((invite) =>
          invite.type === "friend_request" ? (
            <FriendRequest
              key={invite.id}
              request={invite}
              onRemove={handleRemoveInvite}
            />
          ) : (
            <ChannelInvitation
              key={invite.id}
              invite={invite}
              onRemove={handleRemoveInvite}
            />
          )
        )
      )}
    </div>
  );
};

export default InvitesList;
