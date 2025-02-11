import { createClient } from "@supabase/supabase-js";
import { defineNuxtPlugin, useRuntimeConfig } from "nuxt/app";

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig();
  
  const supabase = createClient(
    String(config.public.supabaseUrl),
    String(config.public.supabaseAnonKey)
  );

  return {
    provide: {
      supabase,
    },
  };
});
