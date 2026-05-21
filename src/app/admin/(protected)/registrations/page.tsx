import { createClient } from "@/lib/supabase/server";
import RegistrationsTable from "@/components/admin/RegistrationsTable";

export default async function RegistrationsPage() {
  const supabase = await createClient();

  const [{ data: registrations }, { data: events }] = await Promise.all([
    supabase
      .from("registrations")
      .select("id, full_name, email, phone, organisation, status, created_at, event:events(id, title)")
      .order("created_at", { ascending: false }),
    supabase.from("events").select("id, title").order("title"),
  ]);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Registrations</h1>
      <RegistrationsTable
        initialRegistrations={(registrations ?? []) as unknown as Parameters<typeof RegistrationsTable>[0]["initialRegistrations"]}
        events={events ?? []}
      />
    </div>
  );
}
