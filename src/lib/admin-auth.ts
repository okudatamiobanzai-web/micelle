import { supabase } from "./supabase";

export async function adminSignIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) return { error: error.message };
  if (!data.user) return { error: "ログインに失敗しました" };

  // Check if user is in admin_users table
  const { data: adminData } = await supabase
    .from("admin_users")
    .select("*")
    .eq("user_id", data.user.id)
    .single();

  if (!adminData) {
    await supabase.auth.signOut();
    return { error: "管理者権限がありません" };
  }

  return { user: data.user, admin: adminData };
}

export async function adminSignOut() {
  await supabase.auth.signOut();
}

export async function getAdminSession() {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.user) return null;

  const { data: adminData } = await supabase
    .from("admin_users")
    .select("*")
    .eq("user_id", session.user.id)
    .single();

  if (!adminData) return null;
  return { user: session.user, admin: adminData };
}
