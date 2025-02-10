import {supabase} from "./supabaseClient"

const SupabaseAPI = {
 /** ─────────────────────────────
   *   AUTHENTICATION METHODS
   *  ───────────────────────────── */
    async signUp(email,password){
        const { data, error } = await supabase.auth.signUp({
            email: email,
            password: password,
          })
        this.createUser({id: data.user.id,username: 'testUsername'})
        if(error) console.log(error)
        return data.user
    },

    async signIn(email,password){
        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
          })
        if(error) console.log(error)
        return data.user
    },

    async signOut(){
        await supabase.auth.signOut()
    },

    async getSession() {
        const { data, error } = await supabase.auth.getSession();
        if (error) throw error;
        return data;
      },

   /** ─────────────────────────────
   *   USER MANAGEMENT
   *  ───────────────────────────── */
    async createUser(userData) {
        const { data, error } = await supabase.from('users').insert(userData);
        if (error) console.log(error)
        return data;
    },

    async getUser(userId) {
        const { data, error } = await supabase.from('users').select('*').eq('id', userId).single();
        if (error) console.log(error)
        return data;
    },

    async getAllUsers() {
        const { data, error } = await supabase.from('users').select('*');
        if (error) console.log(error)
        return data;
    },

    /** ─────────────────────────────
   *   TEXT CHANNEL MANAGEMENT
   *  ───────────────────────────── */

    async getAllChannels(){
        const{data,error} = await supabase
        .from('channel')
        .select('*')
        if(error) console.log(error)
        return data
    },

    async getChannel(channelId){
        const {data,error} = await supabase
        .from('channel')
        .select('*')
        .eq('id', channelId)
        .single()
        if(error) console.log(error)
        return data
    },

    async createChannel(channelData) {
        const { data, error } = await supabase.from('channels').insert(channelData);
        if (error) console.log(error)
        return data;
    },

    async getChannelMessages(channelId) {
        const { data, error } = await supabase.from('messages').select('*').eq('channel_id', channelId).order('created_at', { ascending: true });
        if (error) console.log(error)
        return data;
    },

    async sendChannelMessage(userId, channelId, messageText) {
        const { data, error } = await supabase.from('messages').insert({ user_id: userId, channel_id: channelId, message: messageText });
        if (error) console.log(error)
        return data;
    },

    async getUserChannels(userId){
    const {data,error} = await supabase
    .from('users_channels')
    .eq('user_id',userId)

    if(error) console.log( error)
    
    return data
    },

    async addUserToChannel(userId,channelId){
    const {error} = await supabase
    .from('users_channels')
    .insert({user_id:userId, channelId: channelId })

    if(error) console.log(error)
    },

      /** ─────────────────────────────
   *   DIRECT MESSAGING (DMs)
   *  ───────────────────────────── */
      async sendDirectMessage(senderId, receiverId, messageText) {
        const { data, error } = await supabase.from('direct_messages').insert({ sender_id: senderId, receiver_id: receiverId, message: messageText });
        if (error) console.log(error)
        return data;
      },

      async getDirectMessages(userId,contactId){
        const { data, error } = await supabase.from('direct_messages')
            .select('*')
            .or(`(sender_id.eq.${userId},receiver_id.eq.${contactId}),(sender_id.eq.${contactId},receiver_id.eq.${userId})`)
            .order('created_at', { ascending: true });
        if (error) console.log(error)
        return data;
      },


      /** ─────────────────────────────
   *   MODERATION
   *  ───────────────────────────── */
      async deleteUserFromChannel(userId, channelId){
        const response = await supabase
        .from('users_channels')
        .delete()
        .eq('user_id',userId)
        .eq('channel_id',channelId)
      },

      async deleteChannelMessage(messageId){
        const response = await supabase
        .from('channel_messages')
        .delete()
        .eq('id',messageId)
      },

      async deleteChannel(channelId){
        const response = await supabase
        .from('channel')
        .delete()
        .eq('id',channelId)
      }
}

export default SupabaseAPI