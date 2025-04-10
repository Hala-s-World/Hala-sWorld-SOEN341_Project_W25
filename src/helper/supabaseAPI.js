import  supabase from "./supabaseClient";
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
   *   STATUS MANAGEMENT
   *  ───────────────────────────── */
  async getUserStatus(userId) {
    const { data, error } = await supabase
      .from("user_status")
      .select("status")
      .eq("user_id", userId)
      .single();
  
    if (error) console.error("Error fetching user status:", error.message);
    return { data, error };
  },

  async getFriendStatus(friendId) {
    const { data, error } = await supabase
      .from("user_status")
      .select("status")
      .eq("user_id", friendId)
      .single();
  
    if (error) console.error("Error fetching friend status:", error.message);
    return { data, error };
  },

  // Subscribe to real-time updates for the user's status
  subscribeToUserStatus(userId, setStatus) {
    const channel = supabase
      .channel(`public:user_status:user_id=eq.${userId}`)
      .on('postgres_changes', 
        { event: 'UPDATE', schema: 'public', table: 'user_status' }, 
        payload => {
          
          if (payload?.new?.user_id !== userId) {
            return;
          }
          if (payload?.new?.status) {
            setStatus(payload.new.status);
          } else {
            setStatus("offline");
          }
        })
      .subscribe();
  
    return channel;
  },
  
  
  // Subscribe to real-time updates for the friend's status
  subscribeToFriendStatus(friendId, setStatus) {
    const channel = supabase
      .channel(`user_status_friend_${friendId}`) // Unique channel for the friend
      .on('postgres_changes', 
        { event: 'UPDATE', schema: 'public', table: 'user_status' }, 
        async (payload) => {
          console.log("Real-time update received:", payload);
          
          // Fetch the latest status from Supabase
          const { data, error } = await SupabaseAPI.getFriendStatus(friendId);
          if (error) {
            console.error("Error fetching latest status:", error);
            setStatus("offline");
          } else {
            console.log("Verified latest friend status:", data.status);
            setStatus(data?.status ?? "offline");
          }
        })
      .subscribe();

    return channel;
  },

  // Unsubscribe from real-time updates
  unsubscribeFromUserStatus(channel) {
    supabase.removeChannel(channel); 
  },

  async getLastActive(userId){
    const {data,error} = await supabase.from('user_status').select('last_active').eq('user_id',userId).single();  
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

  async getUserProfile(userId) {
    const { data, error } = await supabase
      .from("profiles")
      .select("username, full_name, bio, avatar_url")
      .eq("id", userId)
      .single();
      

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

  async getUsername(userId) {
    const { data, error } = await supabase.from('user').select('username').eq('id', userId).single();
    if (error) throw new Error(error.message);
    return data.username;
    
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

  async getChannelMessages(channelId) {
    const { data, error } = await supabase.from('channel_messages').select('*').eq('channel_id', channelId).order('created_at', { ascending: true });
    if (error) throw new Error(error.message);
    return data;
  },

  async sendChannelMessage(userId, channelId, messageText) {
    const { data, error } = await supabase.from('channel_messages').insert({ user_id: userId, channel_id: channelId, content: messageText });
    if (error) throw new Error(error.message);
    return data;
  },

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

  async subscribeToUnreadMessages(userId, friendId, setUnreadCount) {
    const channel = supabase
        .channel(`unread_messages_${userId}_${friendId}`)
        .on('postgres_changes', 
            { event: 'UPDATE', schema: 'public', table: 'unread_messages' }, 
            async (payload) => {
                console.log("Real-time update received:", payload);
                
                // Fetch the latest unread messages count from Supabase
                const { data, error } = await SupabaseAPI.getUnreadMessagesCount(userId, friendId);
                if (error) {
                    console.error("Error fetching latest unread messages count:", error);
                } else {
                    console.log("Verified latest unread messages count:", data);
                    setUnreadCount(data);
                }
            })
        .subscribe();

    return channel;
},

  async getUnreadMessagesCount(userId, friendId) {
    const { data, error } = await supabase
      .from('unread_messages')
      .select('unread_count')
      .eq('friend_id', friendId)
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') { // Ignore "No Rows Found" error
      throw new Error(error.message);
    }
    return data ? data.unread_count : 0;
  },

  async resetUnreadMessagesCount(userId, friendId) {
    const { data, error } = await supabase
      .from('unread_messages')
      .update({ unread_count: 0 })
      .eq('friend_id', friendId)
      .eq('user_id', userId);

    if (error) throw new Error(error.message);
    return data;
  },

  async IncrementUnreadMessagesCount(senderId, receiverId) {
    // Check if an unread message record exists
    const { data: existingRecord, error: fetchError } = await supabase
        .from('unread_messages')
        .select('unread_count')
        .eq('friend_id', senderId)
        .eq('user_id', receiverId)
        .single();

    if (fetchError && fetchError.code !== 'PGRST116') { // Ignore "No Rows Found" error
        console.error("Error fetching unread message record:", fetchError);
        throw new Error(fetchError.message);
    }

    if (existingRecord) {
        // If the record exists, increment the unread_count
        const { data, error } = await supabase
            .from('unread_messages')
            .update({ unread_count: existingRecord.unread_count + 1 }) // Manually increment
            .eq('friend_id', senderId)
            .eq('user_id', receiverId);

        if (error) {
            console.error("Error incrementing unread count:", error);
            throw new Error(error.message);
        }

        console.log("Incremented unread count:", data);
        return data;
    } else {
        // If no record exists, insert a new one with unread_count = 1
        const { data, error } = await supabase
            .from('unread_messages')
            .insert([{ friend_id: senderId, user_id: receiverId, unread_count: 1 }]);

        if (error) {
            console.error("Error creating unread message record:", error);
            throw new Error(error.message);
        }

        console.log("Created new unread message record:", data);
        return data;
    }
},

unsubscribeFromUnreadMessages(channel) {
    supabase.removeChannel(channel);
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
    console.log(userId, friendId)
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