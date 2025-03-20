import { useEffect, useState } from 'react';
import SupabaseAPI from "../../helper/supabaseAPI";

const FriendStatus = ({ friendId, friendStatus }) => {

  const statusToDisplay = friendStatus;

  return (
    <div className="flex items-center space-x-2">
      <span
        style={{
          display: "inline-block", 
          width: "23px", 
          height: "23px", 
          borderRadius: "50%", 
          backgroundColor:
            statusToDisplay === "online"
              ? "green" // for "online"
              : statusToDisplay === "away"
              ? "yellow" //for "away"
              : "gray", // for "offline"
          marginRight: "5px",
          marginTop: "8px",
        }}
      ></span>
    </div>
  );
};

export default FriendStatus;