import { createClient } from "@supabase/supabase-js";

export const useSupabase = () => {
  const config = useRuntimeConfig();

  const supabase = createClient(
    String(config.public.supabaseUrl),
    String(config.public.supabaseAnonKey)
  );

  return { supabase };
};
