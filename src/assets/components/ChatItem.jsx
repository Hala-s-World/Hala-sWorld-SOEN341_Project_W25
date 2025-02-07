import React from 'react';
import "../styles/Dashboard.css"

export default function ChatItem(){
    return(
        <div className="ChatItem">
            <div className="chat-date">
                06 Feb
            </div>
                <img className="chat-item-profile-picture" src='https://byuc.wordpress.com/wp-content/uploads/2012/07/avat-2.jpg'/>
            <div className='chat-info'>
                <div className="chat-name">
                    example
                </div>
                <div className="chat-text">
                    chat text example 1234 hello hello chat chat text text
                </div>
            </div>
            <div className="chat-number-of-messages">
                5
            </div>
        </div>
    )
}