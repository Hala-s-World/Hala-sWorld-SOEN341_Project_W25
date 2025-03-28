import "../styles/channelmanager.css";

// ChannelCard component that receives channelName as a prop
const ChannelCard = ({ channelName }) => {
    return (
        <div className="ChannelCard">
            <img
                className="channel-img"
                src="https://static.thenounproject.com/png/2448905-200.png"
                alt="Channel"
            />
            <div className="channel-name">{channelName}</div>
        </div>
    );
};

export default ChannelCard;
