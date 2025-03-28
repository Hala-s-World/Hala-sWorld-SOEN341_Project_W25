import supabase from "./supabaseClient";

const addUserToChannel = async (userId, channelId) => {

    const { data, error } = await supabase
        .from("users_channels")
        .insert([
            {
                user_id: userId,
                channel_id: channelId,
            }
        ]);

    if (error) {
        console.error("Error adding user to channel:", error);
        return false;
    }

    console.log("User successfully added to channel:", data);
    return true; 
};

export default addUserToChannel;
