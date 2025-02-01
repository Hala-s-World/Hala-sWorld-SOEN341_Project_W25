import { create } from "zustand";
import {persist} from "zustand/middleware"
import supabase from '../helper/supabaseClient'

export const useAuthStore = create(
    persist(
        (set) => ({
            user: null,
            errorMessage: "", 
            authenticated: false,
            loading: true,

            login: async (email, password) => {
                set({ errorMessage: "" }); 

                const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
                });

                if (error) {
                set({ errorMessage: error.message }); 
                return false;
                }

                set({ user: data.user });
                return true;
            },

            logout: async () => {
                await supabase.auth.signOut();
                set({ user: null, errorMessage: "" });
            },

            checkSession: async () => {
                const {data} = await supabase.auth.checkSession()

                if(data.session){
                    set({user: data.session.user})
                }
            },

            isAuthenticated: async () => {
                const {
                    data
                  } = await supabase.auth.getSession();

                set({authenticated: !!data.session, loading: false})
            }

}),
{name: "auth-storage"}
));
