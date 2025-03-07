import React from 'react';
import "../styles/AddFriendModal.css";

const AddFriendModal = ({ isOpen, onClose, onAddFriend }) => {
  if (!isOpen) return null;

  const handleAddFriend = (e) => {
    e.preventDefault();
    const friendUsername = e.target.elements.friendUsername.value;
    onAddFriend(friendUsername);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Add Friend</h2>
        <form onSubmit={handleAddFriend}>
          <input
            type="text"
            name="friendUsername"
            placeholder="Enter friend's username"
            required
          />
          <button type="submit">Add</button>
          <button type="button" onClick={onClose}>Cancel</button>
        </form>
      </div>
    </div>
  );
};

export default AddFriendModal;