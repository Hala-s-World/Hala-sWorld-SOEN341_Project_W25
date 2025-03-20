import { useEffect, useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import getFriendStatus from '../../helper/supabaseAPI';
import SupabaseAPI from "../../helper/supabaseAPI";
import supabase from "../../helper/supabaseClient";


const FriendStatus = ({ friendId }) => {

  const [friendStatus, setFriendStatus] = useState('loading');
  
  useEffect(() => {
    const fetchFriendStatus = async () => {
        try{
            const { data, error } = await SupabaseAPI.getFriendStatus(friendId);

            console.log("Fetched status data:", data);
            if (error) {
                setFriendStatus('offline'); // Default to 'offline' if there is an error
            } else {
                setFriendStatus(data?.status || 'offline'); // Set status to 'offline' if no status
            }
    } catch(error) {
        console.log("Error fetching friend status:", error);
        setFriendStatus("offline");
    }
    };

    fetchFriendStatus();

    // Subscribe to real-time updates of the friend's status
    const channel = SupabaseAPI.subscribeToFriendStatus(friendId, setFriendStatus);

    // Cleanup subscription on component unmount
    return () => {
      if (channel) {
        supabase.removeChannel(channel); // Unsubscribe when the component unmounts
      }
    };

  }, [friendId]);

  const statusToDisplay = friendStatus;

  return (
    <div className="flex items-center space-x-2">
      <span
        style={{
          display: "inline-block", 
          width: "23px", 
          height: "23px", 
          borderRadius: "50%", 
          backgroundColor:
            statusToDisplay === "online"
              ? "green" // for "online"
              : statusToDisplay === "away"
              ? "yellow" //for "away"
              : "gray", // for "offline"
          marginRight: "5px",
          marginTop: "8px",
        }}
      ></span>
    </div>
  );
};

export default FriendStatus;
