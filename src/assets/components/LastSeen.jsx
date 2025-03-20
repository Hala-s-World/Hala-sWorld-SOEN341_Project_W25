import SupabaseAPI from '../../helper/supabaseAPI';
import { useEffect, useState } from "react";
import "../styles/LastSeen.css"

const LastSeen = ({ friendId }) => {
    const [lastSeenTime, setLastSeenTime] = useState(null);

    useEffect(() => {
        const fetchLastSeen = async () => {
            if (!friendId) return;

            try {
                const data = await SupabaseAPI.getLastActive(friendId);
                

                setLastSeenTime(data);
            } catch (e) {
                console.error("Error getting last seen time:", e.message);
            }
        };

        fetchLastSeen();
    }, [friendId]);

    const formatTime = (time) => {
        if (!time || !time.last_active) return "Unknown";

        const date = new Date(time.last_active);

        // Calculate time difference in hours
        const hoursDiff = Math.abs((Date.now() - date.getTime()) / 3600000);
        
        if (hoursDiff < 1) {
            return "Less than an hour ago";
        } else if (hoursDiff < 24) {
            return `${Math.floor(hoursDiff)} hours ago`;
        } else {
            return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`;
        }
    };

    return (
        <div className="last-seen">
            <p>{formatTime(lastSeenTime)}</p>
        </div>
    );
};

export default LastSeen;
