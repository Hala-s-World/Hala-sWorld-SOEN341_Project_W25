import React, { useState, useEffect } from "react";
import EmojiPicker from "emoji-picker-react";
import supabase from "../../helper/supabaseClient";
import SupabaseAPI from "../../helper/supabaseAPI";
import "../styles/dashboard.css"

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

export default SendMessage;
