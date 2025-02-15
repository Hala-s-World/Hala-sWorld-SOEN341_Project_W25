import { supabase } from "./supabaseClient";

const SupabaseAPI = {
  /** ─────────────────────────────
   *   AUTHENTICATION METHODS
   *  ───────────────────────────── */
  async signUp(email, password) {
    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
    });
    if (error) throw new Error(error.message);
    await this.createUser({ id: data.user.id, username: 'testUsername' });
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
  async createUser(userData) {
    const { data, error } = await supabase.from('user').insert(userData);
    if (error) throw new Error(error.message);
    return data;
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
    const { data, error } = await supabase.from('direct_messages').insert({ sender_id: senderId, receiver_id: receiverId, content: messageText });
    if (error) throw new Error(error.message);
    return data;
  },

  async getDirectMessages(userId, contactId) {
    const { data, error } = await supabase.from('direct_messages')
      .select('*')
      .or(`(sender_id.eq.${userId},receiver_id.eq.${contactId}),(sender_id.eq.${contactId},receiver_id.eq.${userId})`)
      .order('created_at', { ascending: true });
    if (error) throw new Error(error.message);
    return data;
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
  }
}

export default SupabaseAPI;