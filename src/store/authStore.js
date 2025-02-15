import { create } from "zustand";
import { persist } from "zustand/middleware";
import supabase from "../helper/supabaseClient";

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      role: null,
      errorMessage: "",
      authenticated: false,
      loading: true,

      login: async (email, password) => {
        set({ errorMessage: "" });
        
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email,
          password: password,
        });

        if (error) {
          set({ errorMessage: error.message });
            console.log(error)
          return false;
        }

        // Fetch the user's role during login
        const { data: roleData, error: roleError } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", data.user.id)
          .single();

        if (roleError) {
          set({ errorMessage: "Failed to fetch role" });
          return false;
        }

        // Set user, role, and authenticated status
        set({
          user: data.user,
          role: roleData?.role || "user",
          authenticated: true,
          errorMessage: "",
        });

        return true;
      },

      logout: async () => {
        await supabase.auth.signOut();
        set({ user: null, role: null, errorMessage: "", authenticated: false });
      },

      isAuthenticated: async () => {
        const { data } = await supabase.auth.getSession();
        set({ authenticated: !!data.session, loading: false });
      },
    }),
    { name: "auth-storage" }
  )
);

