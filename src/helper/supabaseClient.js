import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://rdnotelsaojvscgmfdve.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJkbm90ZWxzYW9qdnNjZ21mZHZlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzgyNzU0NjksImV4cCI6MjA1Mzg1MTQ2OX0.3wH9FUglUQ-wy9w5pXX2FqWCp6j-_gqL25_zK2O3AIk";

const supabase = createClient(supabaseUrl, supabaseAnonKey);
export default supabase;
