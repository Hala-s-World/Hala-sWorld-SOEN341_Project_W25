import supabase from "./supabaseClient";

const { data, error } = await supabase
    .from('channel_invitations')
    .insert([
        {
            channel_id: 'channel-uuid',
            sender_id: 'creator-uuid',
            recipient_id: 'invited-user-uuid',
            status: 'pending'
        }
    ]);

    // update invitation status
const { error: updateError } = await supabase
.from('channel_invitations')
.update({ status: 'accepted' })
.eq('id', 'invitation-uuid');

// Step 2: Add user to channel
if (!updateError) {
await supabase
    .from('users_channels')
    .insert([
        {
            user_id: 'invited-user-uuid',
            channel_id: 'channel-uuid',
            added_by: 'creator-uuid'  // Track who added them
        }
    ]);
}

//reject invitation
await supabase
    .from('channel_invitations')
    .update({ status: 'rejected' })
    .eq('id', 'invitation-uuid');

    //list pending invitations for a user
    const { data: invitations } = await supabase
    .from('channel_invitations')
    .select(`
        id,
        channel_id,
        sender_id,
        channels:channel_id (channel_name, is_private),
        senders:sender_id (username, avatar_url)
    `)
    .eq('recipient_id', 'current-user-uuid')
    .eq('status', 'pending');