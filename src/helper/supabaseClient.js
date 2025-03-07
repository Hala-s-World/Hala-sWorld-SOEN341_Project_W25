import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://ahsfvctbozbruwgkspsp.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFoc2Z2Y3Rib3picnV3Z2tzcHNwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEzODQxMTIsImV4cCI6MjA1Njk2MDExMn0.kI7N7HpmrL4_VPvCAe3XfyM7jrTWLx4f9R0XhCMzlUo";

// Create the Supabase client
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase;
