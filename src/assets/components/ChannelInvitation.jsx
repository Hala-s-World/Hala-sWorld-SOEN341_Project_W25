import React, { useEffect, useState } from "react";
import supabase from "../../helper/supabaseClient";
import "../styles/channelmanager.css";

const ChannelInvitation = ({ invite, onRemove }) => {
  const [channelName, setChannelName] = useState("");

  // Fetch the channel name using the channel_id
  useEffect(() => {
    const fetchChannelName = async () => {
      try {
        const { data, error } = await supabase
          .from("channel")
          .select("channel_name")
          .eq("id", invite.channel_id)
          .single();

        if (error) {
          console.error("Error fetching channel name:", error);
          return;
        }

        setChannelName(data.channel_name);
      } catch (error) {
        console.error("Unexpected error fetching channel name:", error);
      }
    };

    fetchChannelName();
  }, [invite.channel_id]);

  const handleAccept = async () => {
    try {
      // Update the invitation status to "accepted"
      const { error: updateError } = await supabase
        .from("channel_invitations")
        .update({ status: "accepted" })
        .eq("id", invite.id);

      if (updateError) {
        console.error("Error accepting channel invitation:", updateError);
        alert("There was an error processing your request. Please try again.");
        return;
      }

      // Add the user to the channel (e.g., in a "channel_members" table)
      const { error: insertError } = await supabase.from("channel_members").insert([
        {
          channel_id: invite.channel_id,
          user_id: invite.recipient_id,
          joined_at: new Date(),
        },
      ]);

      if (insertError) {
        console.error("Error adding user to channel:", insertError);
        alert("There was an error adding you to the channel. Please try again.");
        return;
      }

      // Remove the invitation from the UI
      onRemove(invite.id);

      // Notify the user
      alert("You have successfully joined the channel!");
    } catch (error) {
      console.error("Error accepting the channel invitation:", error);
      alert("An unexpected error occurred. Please try again.");
    }
  };

  const handleReject = async () => {
    try {
      // Remove the invitation from the "channel_invitations" table
      const { error } = await supabase
        .from("channel_invitations")
        .delete()
        .eq("id", invite.id);

      if (error) {
        console.error("Error rejecting channel invitation:", error);
        alert("There was an error processing your rejection. Please try again.");
        return;
      }

      // Remove the invitation from the UI
      onRemove(invite.id);

      // Notify the user
      alert("Channel invitation rejected.");
    } catch (error) {
      console.error("Error rejecting the channel invitation:", error);
      alert("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <div className="Invitation">
      <div className="channel-info">
        <p>Channel invitation to join {channelName || "Loading..."}</p>
      </div>
      <div className="actions">
        <button onClick={handleAccept} className="accept-btn">
          Accept
        </button>
        <button onClick={handleReject} className="reject-btn">
          Reject
        </button>
      </div>
    </div>
  );
};

export default ChannelInvitation;
