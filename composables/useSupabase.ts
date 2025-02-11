import { createClient } from "@supabase/supabase-js"
import { useRouter } from "vue-router"
import { useRuntimeConfig } from "#app";

const config = useRuntimeConfig()
const router = useRouter()

const supabase = createClient(
  String(config.public.supabaseUrl),
  String(config.public.supabaseAnonKey)
)

const getUserProfile = async () => {
  const { data: user, error } = await supabase.auth.getUser()
  if (error) return null

  const { data: profile } = await supabase
    .from("users")
    .select("*")
    .eq("id", user.user.id)
    .single()

  return profile
}

const logout = async () => {
  await supabase.auth.signOut()
  router.push("/login")
}

export { supabase, getUserProfile, logout }
