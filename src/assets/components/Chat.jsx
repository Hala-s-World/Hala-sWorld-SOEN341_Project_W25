import React from "react";
import ChatItem from "./ChatItem";
import { FaBars, FaTimes, FaComments, FaCog, FaSlidersH, FaMicrophone, FaSmile, FaPaperclip, FaTelegram} from "react-icons/fa";

export default function Chat(){
    return(
        <div className="main">
                <div className="chat-container">
                  <div className="chat-container-left">
                    <ChatItem />
                    <ChatItem />
                    <ChatItem />
                    <ChatItem />
                    <ChatItem />
                    <ChatItem />
                  </div>
                  <div className="chat-container-right">
                    <div className="opened-chat-banner">
                      banner
                    </div>
                    <div className="opened-chat-box">
                      <div className="chat-box-chat"></div>
                      
                      <div className="input-area">
                        <div className="text-input-area">
                          <FaMicrophone className="microphone-icon"/>
                          <input placeholder="Type Here..."></input>
                          <FaSmile className="microphone-icon"/>
                          <FaPaperclip className="microphone-icon"/>
                          <FaTelegram className="send-button"/>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
    )
}