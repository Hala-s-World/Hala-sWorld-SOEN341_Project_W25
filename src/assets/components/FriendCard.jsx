import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { LuMessageCircle } from "react-icons/lu";
import { TiDeleteOutline } from "react-icons/ti";
import { useActiveComponent } from "../../helper/activeComponent";
import { useAuthStore } from "../../store/authStore";
import SupabaseAPI from "../../helper/supabaseAPI";
import FriendStatus from "./GetFriendStatus";
import LastSeen from "./LastSeen";
import UnreadCount from "./UnreadCount";

const FriendCard = ({ friendId, friendName }) => {
  const { setActiveComponent } = useActiveComponent();
  const { setCurrentFriend, user } = useAuthStore();
  const [userStatus, setUserStatus] = useState(null);
  const [lastSeenTime, setLastSeenTime] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
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

    const fetchUnreadCount = async () => {
      try {
        const count = await SupabaseAPI.getUnreadMessagesCount(
          user.id,
          friendId
        );
        console.log("unread count:", count);
        setUnreadCount(count);
      } catch (error) {
        console.error("Error fetching unread messages count:", error);
      }
    };

    fetchStatus();
    fetchLastSeen();
    fetchUnreadCount();

    const statusChannel = SupabaseAPI.subscribeToFriendStatus(
      friendId,
      setUserStatus
    );
    const unreadMessagesChannel = SupabaseAPI.subscribeToUnreadMessages(
      user.id,
      friendId,
      setUnreadCount
    );

    return () => {
      SupabaseAPI.unsubscribeFromUserStatus(statusChannel);
      SupabaseAPI.unsubscribeFromUnreadMessages(unreadMessagesChannel);
    };
  }, [friendId, user.id]);

  const handleChatOnClick = () => {
    setCurrentFriend({ friendName: friendName, friendId: friendId });
    setActiveComponent("Direct-Messaging");

    if (userStatus === "offline") {
      SupabaseAPI.resetUnreadMessagesCount(user.id, friendId);
      setUnreadCount(0);
    }
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
          {userStatus === "offline" && (
            <LastSeen friendId={friendId} lastSeenTime={lastSeenTime} />
          )}
          <FriendStatus friendId={friendId} friendStatus={userStatus} />
          <UnreadCount unreadCount={unreadCount} />
        </>
      )}
      <LuMessageCircle
        className="icon message-icon"
        onClick={handleChatOnClick}
      />
      <TiDeleteOutline
        className="icon delete-icon"
        onClick={handleDeleteOnClick}
      />
    </div>
  );
};

FriendCard.propTypes = {
  friendId: PropTypes.string.isRequired,
  friendName: PropTypes.string.isRequired,
};

export default FriendCard;
