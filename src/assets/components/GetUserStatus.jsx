import { useEffect, useState } from "react";
import SupabaseAPI from "../../helper/supabaseAPI";
import { useAuthStore } from "../../store/authStore";

const GetUserStatus = () => {
  const { user } = useAuthStore(); // Get current user from the store
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    if (!user?.id) {
      // If the user is not logged in, set status to offline
      setStatus("offline");
      return;
    }

    // Function to fetch the initial status
    const fetchStatus = async () => {
      try {
        const { data, error } = await SupabaseAPI.getUserStatus(user.id);

        if (error) {
          console.error("Error fetching user status:", error.message);
          setStatus("unknown");
          return;
        }

        // Set the initial status (default to "online" if no status is found)
        setStatus(data?.status || "online");
      } catch (err) {
        console.error("Error fetching user status:", err.message);
        setStatus("unknown");
      }
    };

    fetchStatus();

    // Subscribe to real-time updates for the user's status
    const channel = SupabaseAPI.subscribeToUserStatus(user.id, (newStatus) => {
      console.log("Real-time status update received:", newStatus);
      setStatus(newStatus || "offline");
    });

    // Cleanup subscription on component unmount or user change
    return () => {
      SupabaseAPI.unsubscribeFromUserStatus(channel);
    };
  }, [user?.id]);

  return (
    <div className="flex items-center space-x-2">
      <span
        className={`w-3 h-3 rounded-full ${
          status === "online"
            ? "bg-green-500"
            : status === "away"
            ? "bg-yellow-500"
            : status === "offline"
            ? "bg-gray-500"
            : "bg-red-500" // For unknown or error states
        }`}
      ></span>
      <span className="text-sm font-medium">
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    </div>
  );
};

export default GetUserStatus;
