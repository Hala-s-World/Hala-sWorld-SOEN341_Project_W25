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
import { useNavigate } from "react-router-dom";
import supabase from "../../helper/supabaseClient";

const FriendCard = ({ friendId, friendName }) => {
  const { setActiveComponent } = useActiveComponent();
  const { setCurrentFriend, user } = useAuthStore();
  const [userStatus, setUserStatus] = useState(null);
  const [lastSeenTime, setLastSeenTime] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [friendAvatar, setFriendAvatar] = useState(null); // Friend's avatar URL
  const [isAvatarLoaded, setIsAvatarLoaded] = useState(false); // Track avatar loading state
  const navigate = useNavigate();

  const handleSelectUser = () => {
    navigate(`/profile/${friendId}`);
  };

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
        setUnreadCount(count);
      } catch (error) {
        console.error("Error fetching unread messages count:", error);
      }
    };

    const fetchFriendAvatar = async () => {
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("avatar_url")
          .eq("id", friendId)
          .single();

        if (error) {
          console.error("Error fetching friend's avatar:", error.message);
        }

        if (data?.avatar_url) {
          setFriendAvatar(data.avatar_url); // Set the friend's avatar URL
        } else {
          setFriendAvatar(null); // Explicitly set to null if no avatar exists
        }
      } catch (error) {
        console.error("Error fetching friend's profile:", error.message);
        setFriendAvatar(null); // Explicitly set to null in case of error
      } finally {
        setIsAvatarLoaded(true); // Mark avatar loading as complete
      }
    };

    fetchStatus();
    fetchLastSeen();
    fetchUnreadCount();
    fetchFriendAvatar(); // Fetch the friend's avatar

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

  const handleChatOnClick = (e) => {
    e.stopPropagation(); // Prevent the parent onClick from firing
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
    <div onClick={handleSelectUser} className="friend-card">
      <img
        className="chat-item-profile-picture"
        src={
          isAvatarLoaded
            ? friendAvatar || "https://byuc.wordpress.com/wp-content/uploads/2012/07/avat-2.jpg" // Default avatar if no avatar exists
            : "" // Empty string while loading
        }
        alt="User avatar"
        onLoad={() => setIsAvatarLoaded(true)} // Mark as loaded when the image finishes loading
        onError={() => setFriendAvatar(null)} // Handle image load errors
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
        onClick={handleChatOnClick} // Call the updated function
      />
      <TiDeleteOutline
        className="icon delete-icon"
        onClick={(e) => {
          e.stopPropagation(); // Prevent the parent onClick from firing
          handleDeleteOnClick();
        }}
      />
    </div>
  );
};

FriendCard.propTypes = {
  friendId: PropTypes.string.isRequired,
  friendName: PropTypes.string.isRequired,
};

export default FriendCard;
