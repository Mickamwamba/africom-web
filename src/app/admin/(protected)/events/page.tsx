import Link from "next/link";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getRole } from "@/lib/auth";
import DeleteEventButton from "@/components/admin/DeleteEventButton";

interface Category { id: string; name: string }
interface Event {
  id: string; title: string; type: string; category: Category | null;
  start_at: string; status: string;
}

async function toggleStatus(id: string, current: string) {
  "use server";
  const { createClient: create } = await import("@/lib/supabase/server");
  const supabase = await create();
  await supabase.from("events").update({ status: current === "published" ? "draft" : "published" }).eq("id", id);
  revalidatePath("/admin/events");
  revalidatePath("/events");
}

async function deleteEvent(id: string) {
  "use server";
  const { createClient: create } = await import("@/lib/supabase/server");
  const supabase = await create();
  await supabase.from("events").delete().eq("id", id);
  revalidatePath("/admin/events");
  revalidatePath("/events");
}

export default async function AdminEventsPage() {
  const supabase = await createClient();
  const role = await getRole(supabase);
  const { data: events } = await supabase
    .from("events")
    .select("id, title, type, category:categories(id, name), start_at, status")
    .order("created_at", { ascending: false });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Events</h1>
        <Link
          href="/admin/events/new"
          className="rounded-lg bg-brand-earth-brown px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
        >
          + New Event
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              {["Title", "Type", "Category", "Start Date", "Status", "Actions"].map((h) => (
                <th key={h} className="text-left px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wide">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {(events ?? []).length === 0 ? (
              <tr><td colSpan={6} className="px-4 py-10 text-center text-gray-400">No events yet.</td></tr>
            ) : (
              (events as unknown as Event[]).map((event) => (
                <tr key={event.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900 max-w-xs truncate">{event.title}</td>
                  <td className="px-4 py-3 capitalize text-gray-600">{event.type}</td>
                  <td className="px-4 py-3 text-gray-600">{event.category?.name ?? "—"}</td>
                  <td className="px-4 py-3 text-gray-600">
                    {new Date(event.start_at).toLocaleDateString("en-GB")}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                      event.status === "published"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-600"
                    }`}>
                      {event.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Link href={`/admin/events/${event.id}/edit`} className="text-blue-600 hover:text-blue-800">Edit</Link>
                      <form action={toggleStatus.bind(null, event.id, event.status)}>
                        <button type="submit" className="text-gray-500 hover:text-gray-700">
                          {event.status === "published" ? "Unpublish" : "Publish"}
                        </button>
                      </form>
                      {role === "admin" && (
                        <DeleteEventButton action={deleteEvent.bind(null, event.id)} />
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
