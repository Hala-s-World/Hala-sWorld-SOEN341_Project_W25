// Fetch messages for a given channel
export async function getChannelMessages(channelId) {
  const { data, error } = await supabase
    .from("channel_messages")
    .select("id, content, created_at, sender:users(id, username)")
    .eq("channel_id", channelId)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Error fetching channel messages:", error);
    return [];
  }

  return data;
}

//Send a message to a channel
export async function sendChannelMessage(senderId, channelId, message) {
  const { data, error } = await supabase
    .from("channel_messages")
    .insert([{ sender_id: senderId, channel_id: channelId, content: message }])
    .select();

  if (error) {
    console.error("Error sending channel message:", error);
    return null;
  }

  return data;
}

//Check if a user is in a channel before sending a message
export async function isUserInChannel(userId, channelId) {
  const { data, error } = await supabase
    .from("users_channels")
    .select("user_id")
    .eq("user_id", userId)
    .eq("channel_id", channelId);

  if (error || data.length === 0) {
    return false;
  }

  return true;
}
