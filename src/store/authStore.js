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

          console.log("User ID:", data.user.id);

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
            authenticated: true,
            errorMessage: "",
          });

          return true;
        } catch (err) {
          console.log("Unexpected error:", err);
          set({ errorMessage: "An unexpected error occurred" });
          return false;
        }
      },

      logout: async () => {
        await supabase.auth.signOut();
        set({ user: null, role: null, errorMessage: "", authenticated: false });
      },

      isAuthenticated: async () => {
        const { data } = await supabase.auth.getSession();
        console.log(data);
        set({ authenticated: !!data.session, loading: false });
      },
    }),
    { name: "auth-storage" }
  )
);

