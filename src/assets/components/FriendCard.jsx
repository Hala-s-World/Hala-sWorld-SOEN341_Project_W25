import React from 'react';
import { LuMessageCircle } from "react-icons/lu";
import { TiDeleteOutline } from "react-icons/ti";
import { useActiveComponent } from "../../helper/activeComponent";
import { useAuthStore } from '../../store/authStore';
import SupabaseAPI from '../../helper/supabaseAPI';

const FriendCard = ({ friendId, friendName }) => {

    const { setActiveComponent } = useActiveComponent();
    const { currentFriend, setCurrentFriend, user } = useAuthStore();
    
    const handleChatOnClick = () => {
        setCurrentFriend({"friendName": friendName, "friendId": friendId});
        setActiveComponent("Direct-Messaging");
    };

    const handleDeleteOnClick = async () => {
        await SupabaseAPI.deleteFriend(user.id,friendId);
        
    }

    return (
        <div className="friend-card">
             <img
                        className="chat-item-profile-picture"
                        src="https://byuc.wordpress.com/wp-content/uploads/2012/07/avat-2.jpg"
                        alt="User avatar"
                    />
            <div className="friend-name">{friendName}</div>
            <LuMessageCircle className="icon message-icon" onClick={handleChatOnClick} />
            <TiDeleteOutline className="icon delete-icon" onClick={handleDeleteOnClick}/>
        </div>
    );
};

export default FriendCard;
