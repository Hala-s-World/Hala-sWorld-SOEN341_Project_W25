import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import supabase from "../helper/supabaseClient";

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      role: null,
      errorMessage: "",
      authenticated: false,
      loading: true,
      currentFriend: null,
      setCurrentFriend: (friend) => set({ currentFriend: friend }),
      listening: false, 

      isAuthenticated: async () => {
        const { data } = await supabase.auth.getSession();
        console.log(data);
        set({ authenticated: !!data.session, loading: false });
      },
    
      login: async (email, password) => {
        set({ errorMessage: "" });

        try {
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
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
              last_active: new Date().toISOString()
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

      restoreSession: async () => {
        const { data } = await supabase.auth.getSession();
        
        if (data?.session) {
          set({
            user: data.session.user,
            authenticated: true,
            loading: false,
          });
        } else {
          console.log("No active session found.");
          set({ authenticated: false, loading: false });
        }
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
    {
      name: "newstoragekey",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);

useAuthStore.getState().restoreSession();

window.addEventListener("beforeunload", async () => {
  await supabase.auth.signOut();
});
