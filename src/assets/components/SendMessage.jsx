import React, { useState, useEffect } from 'react';
import supabase from '../../helper/supabaseClient'; 
import SupabaseAPI from '../../helper/supabaseAPI';

const SendMessage = ({message, setMessage, handleSendMessage, isSending }) => {

  return (
    <div>
      
      <form onSubmit={handleSendMessage}>
        <div className="input-area">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
            disabled={isSending}
          />
          <button className='sendButton' type="submit" disabled={isSending}>Send</button>
        </div>
      </form>
    </div>
  );
};

export default SendMessage;
