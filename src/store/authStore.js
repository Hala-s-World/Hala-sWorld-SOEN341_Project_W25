import { create } from "zustand";
import { persist } from "zustand/middleware";
import supabase from "../helper/supabaseClient";

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      role: null,
      errorMessage: "",
      authenticated: false,
      loading: true,
      currentFriend:null,
      listening: false, 

      setCurrentFriend: (friend) => set({ currentFriend: friend }),
    
      login: async (email, password) => {
        set({ errorMessage: "" });

        try {
          const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
          });

          if (error) {
            console.log("Login error:", error);
            set({ errorMessage: error.message });
            return false;
          }

        

          // Fetch the user's role during login
          const { data: roleData, error: roleError } = await supabase
            .from("user_roles")
            .select("role")
            .eq("id", data.user.id)
            .single();

          if (roleError) {
            console.log("Role fetch error:", roleError);
            set({ errorMessage: "Failed to fetch role" });
            return false;
          }

          // Set user, role, and authenticated status
          set({
            user: data.user,
            role: roleData?.role || "user",
            session: data.session,
            authenticated: true,
            errorMessage: "",
          });
            // Set the user's status to "online" upon login
          await supabase
          .from('user_status')
          .upsert([
            {
              user_id: data.user.id,
              status: 'online', 
            }
          ]);

          return true;
        } catch (err) {
          console.log("Unexpected error:", err);
          set({ errorMessage: "An unexpected error occurred" });
          return false;
        }
      },
      setAuthenticatedUser: (user) => set({ user, authenticated: true }),
      setSession: (session) => set({ session }),
      
      logout: async () => {
        if (get().user?.id) {
          await supabase
            .from("user_status")
            .upsert([
              {
                user_id: get().user.id,
                status: "offline",
              },
            ]);
        }

        await supabase.auth.signOut();
        set({ user: null, role: null, errorMessage: "", authenticated: false });
      },

      isAuthenticated: async () => {
        const { data } = await supabase.auth.getSession();
        console.log(data);
        set({ authenticated: !!data.session, loading: false });
      },

       subscribeToAuthChanges: () => {
        if (get().listening) return; 
        const authListener = supabase.auth.onAuthStateChange((event, session) => {
          if (event === "SIGNED_IN" || event === "SIGNED_OUT") {
            set({ user: session?.user ?? null }); 
          }
        });

        set({ listening: true }); 
        return authListener;
      },

      stopListening: () => {
        const listener = get().subscribeToAuthChanges(); 
        if (listener) {
          listener.unsubscribe(); 
        }
        set({ listening: false });
      },
    }),

    
    { name: "auth-storage" }
  )
);

