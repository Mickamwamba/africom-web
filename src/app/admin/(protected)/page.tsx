import { createClient } from "@/lib/supabase/server";
import DashboardStats from "@/components/admin/DashboardStats";

export default async function AdminDashboardPage() {
  const supabase = await createClient();
  const now = new Date().toISOString();

  const [
    { count: totalEvents },
    { count: upcomingEvents },
    { count: totalRegistrations },
    { count: unreadInquiries },
  ] = await Promise.all([
    supabase.from("events").select("*", { count: "exact", head: true }),
    supabase.from("events").select("*", { count: "exact", head: true })
      .eq("status", "published").gte("end_at", now),
    supabase.from("registrations").select("*", { count: "exact", head: true }),
    supabase.from("inquiries").select("*", { count: "exact", head: true }).eq("is_read", false),
  ]);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>
      <DashboardStats
        totalEvents={totalEvents ?? 0}
        upcomingEvents={upcomingEvents ?? 0}
        totalRegistrations={totalRegistrations ?? 0}
        unreadInquiries={unreadInquiries ?? 0}
      />
    </div>
  );
}
