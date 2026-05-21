import { redirect } from "next/navigation";
import type { SupabaseClient } from "@supabase/supabase-js";

export async function getRole(
  supabase: SupabaseClient
): Promise<"admin" | "staff" | null> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", user.id)
    .single();

  return (data?.role as "admin" | "staff" | null) ?? null;
}

export async function requireStaff(supabase: SupabaseClient): Promise<void> {
  const role = await getRole(supabase);
  if (role !== "admin" && role !== "staff") {
    redirect("/admin/login");
  }
}

export async function requireAdmin(supabase: SupabaseClient): Promise<void> {
  const role = await getRole(supabase);
  if (role !== "admin") {
    redirect("/admin/login");
  }
}
