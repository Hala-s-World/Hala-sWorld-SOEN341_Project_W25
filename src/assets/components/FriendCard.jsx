import { useState, useEffect } from "react";
import { LuMessageCircle } from "react-icons/lu";
import { TiDeleteOutline } from "react-icons/ti";
import { useActiveComponent } from "../../helper/activeComponent";
import { useAuthStore } from '../../store/authStore';
import SupabaseAPI from '../../helper/supabaseAPI';
import supabase from "../../helper/supabaseClient";
import FriendStatus from "./GetFriendStatus"
import LastSeen from './LastSeen';

const FriendCard = ({ friendId, friendName }) => {
    const { setActiveComponent } = useActiveComponent();
    const { setCurrentFriend, user } = useAuthStore();
    const [userStatus, setUserStatus] = useState(null); 
    const [lastSeenTime, setLastSeenTime] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const fetchStatus = async () => {
            try {
                const { data } = await SupabaseAPI.getUserStatus(friendId);
                setUserStatus(data?.status ?? "offline");
            } catch (error) {
                console.error("Error fetching user status:", error);
                setUserStatus("offline");
            } finally {
                setIsLoaded(true);
            }
        };

        const fetchLastSeen = async () => {
            if (!friendId) return;

            try {
                const data = await SupabaseAPI.getLastActive(friendId);
                setLastSeenTime(data);
            } catch (e) {
                console.error("Error getting last seen time:", e.message);
            }
        };

        fetchStatus();
        fetchLastSeen();

        const channel = SupabaseAPI.subscribeToFriendStatus(friendId, setUserStatus);

        return () => {
            SupabaseAPI.unsubscribeFromUserStatus(channel);
        };
    }, [friendId]);

    const handleChatOnClick = () => {
        setCurrentFriend({ "friendName": friendName, "friendId": friendId });
        setActiveComponent("Direct-Messaging");
    };

    const handleDeleteOnClick = async () => {
        await SupabaseAPI.deleteFriend(user.id, friendId);
    };

    return (
        <div className="friend-card">
            <img
                className="chat-item-profile-picture"
                src="https://byuc.wordpress.com/wp-content/uploads/2012/07/avat-2.jpg"
                alt="User avatar"
            />
            <div className="friend-name">{friendName}</div>

            {/* Only render status components after it's loaded */}
            {isLoaded && (
                <>
                    {userStatus === 'offline' && <LastSeen friendId={friendId} lastSeenTime={lastSeenTime} />}
                    <FriendStatus friendId={friendId} friendStatus={userStatus} />
                </>
            )}
            <LuMessageCircle className="icon message-icon" onClick={handleChatOnClick} />
            <TiDeleteOutline className="icon delete-icon" onClick={handleDeleteOnClick} />
        </div>
    );
};

export default FriendCard;
