import { FaArrowLeft } from "react-icons/fa";

const ChannelChat = ({channel, onBack}) => {
    return(
        <div className="ChannelChat">
            <button className="back-button" onClick={onBack}>
            <FaArrowLeft/>
            </button>
            <h2>Chat for: {channel.channe_name}</h2>
        </div>
    )
}

export default ChannelChat;