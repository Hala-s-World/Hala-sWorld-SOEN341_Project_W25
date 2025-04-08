import "../styles/channelmanager.css";

const ChannelCard = ({
    channelName,
    onJoin,
    onDelete,
    isAdmin,
    onClick,
    isPrivate}) => {
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
            {!isPrivate && (
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

export default ChannelCard;
