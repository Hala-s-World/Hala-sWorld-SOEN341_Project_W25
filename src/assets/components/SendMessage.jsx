import React, { useState } from "react";
import PropTypes from "prop-types";
import EmojiPicker from "emoji-picker-react";
import "../styles/dashboard.css";

const SendMessage = ({ message, setMessage, handleSendMessage, isSending }) => {
  const [showEmojiPicker, setshowEmojiPicker] = useState(false);

  const onEmojiClick = (emojiData) => {
    setMessage((prev) => prev + emojiData.emoji);
  };

  return (
    <div style={{ position: "relative" }}>
      <form className="send-message-form" onSubmit={handleSendMessage}>
        <div className="input-area">
          <button
            type="button"
            onClick={() => setshowEmojiPicker((prev) => !prev)}
            className="emoji-toggle"
          >
            😊
          </button>

          {showEmojiPicker && (
            <div className="emoji-picker-wrapper">
              <EmojiPicker onEmojiClick={onEmojiClick} />
            </div>
          )}

          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
            disabled={isSending}
          />
          <button className="sendButton" type="submit" disabled={isSending}>
            Send
          </button>
        </div>
      </form>
    </div>
  );
};

SendMessage.propTypes = {
  message: PropTypes.string.isRequired,
  setMessage: PropTypes.func.isRequired,
  handleSendMessage: PropTypes.func.isRequired,
  isSending: PropTypes.bool.isRequired,
};

export default SendMessage;
