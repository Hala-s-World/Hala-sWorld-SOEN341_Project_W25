import { useEffect, useState } from "react";
import SupabaseAPI from "../../helper/supabaseAPI";
import { useAuthStore } from "../../store/authStore";
import supabase from "../../helper/supabaseClient";

const GetUserStatus = () => {
    const { user } = useAuthStore(); // Get current user from the store
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    if (!user?.id) { // if user is not logged then offline
        setStatus("offline")
     return; 
    }
    // Function to fetch the initial status
    const fetchStatus = async () => {
      try {
        console.log("Fetching status for userId:", user.id);
        const { data, error } = await SupabaseAPI.getUserStatus(user.id);
        console.log("Fetched status data:", data);

        if (error) throw new Error(error);

        if (data?.status) {
        setStatus(data.status); 
        } else {
        setStatus("online");
        }
      } catch (err) {
        console.error("Error fetching user status:", err.message);
        setStatus("unknown");
      }
    };

    fetchStatus();

     // Subscribe to real-time updates for the user's status
    const channel = SupabaseAPI.subscribeToUserStatus(user.id, setStatus);

    // Cleanup subscription on component unmount or user change
    return () => {
      SupabaseAPI.unsubscribeFromUserStatus(channel);
    };
  }, [user?.id]); 

  // When the user is logged out, set the status to offline
  useEffect(() => {
    if (!user) {
      setStatus("offline");
    }
  }, [user]); 

 
  return (
    <div className="flex items-center space-x-2">
      <span
        className={`w-3 h-3 rounded-full ${
          status === "online"
            ? "bg-green-500"
            : status === "away"
            ? "bg-yellow-500"
            : "bg-gray-500"
        }`}
      ></span>
      <span className="text-sm font-medium">
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    </div>
  );
};

export default GetUserStatus;
