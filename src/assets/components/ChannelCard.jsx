import React from "react";
import PropTypes from "prop-types";
import "../styles/channelmanager.css";

const ChannelCard = ({
    channelName,
    onJoin,
    onDelete,
    isAdmin,
    onClick,
    isPrivate,
    isMember}) => {
        
    return (
        <div className="ChannelCard" onClick={onClick}>
            {isAdmin && (
                <button className="delete-button" onClick={onDelete}>
                    ❌
                </button>
            )}
            <img
                className="channel-img"
                src="https://static.thenounproject.com/png/2448905-200.png"
                alt="Channel"
            />
            <div
                className="channel-name">
                {channelName}
                {isPrivate && <span className="private-badge">Private</span>}
            </div>
            {!isPrivate && !isMember && (
                <button
                    className="join-button"
                    onClick={(e) => {
                        e.stopPropagation();
                        onJoin();
                    }}>
                    Join
                </button>
            )}
            
        </div>
    );
};

ChannelCard.propTypes = {
    channelName: PropTypes.string.isRequired,
    onJoin: PropTypes.func.isRequired,
    onDelete: PropTypes.func,
    isAdmin: PropTypes.bool,
    onClick: PropTypes.func,
    isPrivate: PropTypes.bool,
    isMember: PropTypes.bool,
};

export default ChannelCard;
