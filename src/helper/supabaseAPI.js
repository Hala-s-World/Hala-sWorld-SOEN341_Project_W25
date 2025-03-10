import supabase from "./supabaseClient";
import { format } from "date-fns";

const SupabaseAPI = {
  /** ─────────────────────────────
   *   AUTHENTICATION METHODS
   *  ───────────────────────────── */
  async signUp(email, password) {
    //create user in supabase
    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
    });

    //insert new record in user table
    if (error) throw new Error(error.message);
    await this.createUser(data.user.id,'testUsefasdrname' );

    //insert role "user" for new user
    await this.createUserRole(data.user.id)
    return data.user;
  },

  async signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });
    if (error) throw new Error(error.message);
    return data.user;
  },

  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw new Error(error.message);
  },

  async getSession() {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw new Error(error.message);
    return data;
  },

  /** ─────────────────────────────
   *   USER MANAGEMENT
   *  ───────────────────────────── */
  async createUser(userId, username="temp_username") {
    const { data, error } = await supabase.from('user').insert({ id: userId, username: username  });
    if (error) throw new Error(error.message);
    return data;
  },

 

  async createUserRole(userId){
    const { error } = await supabase
      .from("user_roles")
      .insert({ id: userId, role: "user" });
      if (error) throw new Error(error.message);
      
  },

  async getUser(userId) {
    const { data, error } = await supabase.from('user').select('*').eq('id', userId).single();
    if (error) throw new Error(error.message);
    return data;
  },

  async getAllUsers() {
    const { data, error } = await supabase.from('user').select('*');
    if (error) throw new Error(error.message);
    return data;
  },


  
  /** ─────────────────────────────
   *   TEXT CHANNEL MANAGEMENT
   *  ───────────────────────────── */
  async getAllChannels() {
    const { data, error } = await supabase.from('channel').select('*');
    if (error) throw new Error(error.message);
    return data;
  },

  async getChannelByName(channelName) {
    const { data, error } = await supabase.from('channel').select('*').eq('channel_name', channelName).single();
    if (error) throw new Error(error.message);
    return data;
  },

  async getChannel(channelId) {
    const { data, error } = await supabase.from('channel').select('*').eq('id', channelId).single();
    if (error) throw new Error(error.message);
    return data;
  },

  async createChannel(channelData) {
    const { data, error } = await supabase.from('channel').insert(channelData);
    if (error) throw new Error(error.message);
    return data;
  },

  async function getChannelMessages(channelId) {
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


  async function sendChannelMessage(senderId, channelId, message) {
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
  async function isUserInChannel(userId, channelId) {
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

  async getUserChannels(userId) {
    const { data, error } = await supabase.from('users_channels').eq('user_id', userId);
    if (error) throw new Error(error.message);
    return data;
  },

  async addUserToChannel(userId, channelId) {
    const { error } = await supabase.from('users_channels').insert({ user_id: userId, channelId: channelId });
    if (error) throw new Error(error.message);
  },

  /** ─────────────────────────────
   *   DIRECT MESSAGING (DMs)
   *  ───────────────────────────── */
  async sendDirectMessage(senderId, receiverId, messageText) {
    const { data, error } = await supabase.from('direct_messages').insert([{ sender_id: senderId, receiver_id: receiverId, content: messageText }]).select(); 
  if (error) {
    console.error("Error sending message:", error.message);
    throw new Error(error.message);
  }
  console.log("data inserted sucessfully:", data) // make sure message sent to database

  return data; 
  },

  async getDirectMessages(senderId, receiverId) {
    const { data, error } = await supabase
      .from('direct_messages')
      .select(`
        *,
        sender:sender_id ( username ),
        receiver:receiver_id ( username )
      `)
      .or(`and(sender_id.eq.${senderId},receiver_id.eq.${receiverId}),and(sender_id.eq.${receiverId},receiver_id.eq.${senderId})`)
      .order('created_at', { ascending: true });

    if (error) throw new Error(error.message);

    return data.map((message) => ({
      ...message,
      sender_username: message.sender.username,
      receiver_username: message.receiver.username,
      formattedDate: format(new Date(message.created_at), "dd MMM yyyy HH:mm"),
    }));
  },

  /** ─────────────────────────────
   *   MODERATION
   *  ───────────────────────────── */
  async deleteUserFromChannel(userId, channelId) {
    const { error } = await supabase.from('users_channels').delete().eq('user_id', userId).eq('channel_id', channelId);
    if (error) throw new Error(error.message);
  },

  async deleteChannelMessage(messageId) {
    const { error } = await supabase.from('channel_messages').delete().eq('id', messageId);
    if (error) throw new Error(error.message);
  },

  async deleteChannel(channelId) {
    const { error } = await supabase.from('channel').delete().eq('id', channelId);
    if (error) throw new Error(error.message);
  },

  /** ─────────────────────────────
   *   FRIENDS
   *  ───────────────────────────── */

  async getFriends(userId) {
    const { data, error } = await supabase
      .from('friends')
      .select(`
        *,
        friend_id,
        user:user_id ( username ),
        friend:friend_id ( username )
      `)
      .or(`user_id.eq.${userId},friend_id.eq.${userId}`)
      .eq('status', 'accepted');
  
    if (error) throw new Error(error.message);
  
    return data.map((friend) => ({
      ...friend,
      user_username: friend.user.username,
      friend_username: friend.friend.username,
    }));
  },

  async acceptFriendRequest(userId, friendId) {
    const { data, error } = await supabase
      .from('friends')
      .update({ status: 'accepted' })
      .eq('user_id', userId)
      .eq('friend_id', friendId);
  
    if (error) throw new Error(error.message);
    return data;
  },
  
  async deleteFriend(userId, friendId) {
    const { error } = await supabase
      .from('friends')
      .delete()
      .or(`and(user_id.eq.${userId},friend_id.eq.${friendId}),and(user_id.eq.${friendId},friend_id.eq.${userId})`);
  
    if (error) throw new Error(error.message);
  },


  async addFriend(userId, friendId) {
    const { data, error } = await supabase
      .from('friends')
      .insert([{ user_id: userId, friend_id: friendId, status: 'pending' }]);
  
    if (error) throw new Error(error.message);
    return data;
  }
}

export default SupabaseAPI;
