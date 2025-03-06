import React, { useState, useEffect } from 'react';
import supabase from '../../helper/supabaseClient'; 
import SupabaseAPI from '../../helper/supabaseAPI';

const SendMessage = ({ receiverId, onMessageSent }) => {
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);


  const getCurrentUser = async () => {
    const { data, error } = await supabase.auth.getUser();
    if (error) {
      console.error("Error fetching user:", error.message);
    } else {
      setUser(data.user);
    }
  };

  useEffect(() => {
    getCurrentUser();
  }, []);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    setIsSending(true);
    setError('');

    try {
        console.log("Sending message:", { senderId: user.id, receiverId, messageText: message });

        const data = await SupabaseAPI.sendDirectMessage(user.id, receiverId, message);

        if (data) {
          console.log('Message sent successfully!');
          setMessage(''); 
          onMessageSent(data[0]); 
        }
        } catch (error) {
          console.log('Error sending message:', error);
          setError('There was an error sending your message.');
        } finally {
          setIsSending(false);
        }
      };

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
