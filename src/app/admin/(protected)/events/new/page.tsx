import { createClient } from "@/lib/supabase/server";
import EventForm from "@/components/admin/EventForm";

export default async function NewEventPage() {
  const supabase = await createClient();
  const { data: categories } = await supabase
    .from("categories")
    .select("id, name")
    .order("name");

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">New Event</h1>
      <EventForm categories={categories ?? []} mode="create" />
    </div>
  );
}
