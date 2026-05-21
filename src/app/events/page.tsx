import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import EventGrid from "@/components/events/EventGrid";

interface Category { id: string; name: string }
interface Event {
  id: string; slug: string; title: string; type: "event" | "training";
  category: Category | null; start_at: string; end_at: string;
  location: string; is_online: boolean; is_free: boolean;
  price: number | null; cover_image_url: string | null;
  registration_count?: number;
}

interface PageProps {
  searchParams: Promise<{ type?: string; category?: string }>;
}

export default async function EventsPage({ searchParams }: PageProps) {
  const { type, category } = await searchParams;
  const supabase = await createClient();
  const now = new Date().toISOString();

  let upcomingQ = supabase
    .from("events")
    .select("id, slug, title, type, category:categories(id, name), start_at, end_at, location, is_online, is_free, price, cover_image_url")
    .eq("status", "published")
    .gte("end_at", now)
    .order("start_at", { ascending: true });

  let pastQ = supabase
    .from("events")
    .select("id, slug, title, type, category:categories(id, name), start_at, end_at, location, is_online, is_free, price, cover_image_url")
    .eq("status", "published")
    .lt("end_at", now)
    .order("start_at", { ascending: false });

  const categoriesQ = supabase.from("categories").select("id, name").order("name");

  if (type) {
    upcomingQ = upcomingQ.eq("type", type);
    pastQ = pastQ.eq("type", type);
  }
  if (category) {
    upcomingQ = upcomingQ.eq("category_id", category);
    pastQ = pastQ.eq("category_id", category);
  }

  const [
    { data: upcomingEvents },
    { data: pastEvents },
    { data: categories },
    { data: regCounts },
  ] = await Promise.all([
    upcomingQ,
    pastQ,
    categoriesQ,
    supabase.from("registrations").select("event_id").eq("status", "confirmed").then(
      (r) => ({ data: r.data ?? [] })
    ),
  ]);

  // Build a map of event_id → confirmed registration count
  const countMap: Record<string, number> = {};
  for (const row of regCounts ?? []) {
    countMap[row.event_id] = (countMap[row.event_id] ?? 0) + 1;
  }

  const withCounts = (events: typeof upcomingEvents) =>
    (events ?? []).map((e) => ({ ...e, registration_count: countMap[e.id] ?? 0 }));

  return (
    <main className="min-h-screen bg-white">
      <section className="bg-brand-earth-brown py-16 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-white mb-3">Events &amp; Trainings</h1>
          <p className="text-brand-cream text-lg max-w-xl mx-auto">
            Explore upcoming events and training programmes offered by Africom International.
          </p>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 py-12">
        <Suspense fallback={<div className="text-gray-500">Loading events…</div>}>
          <EventGrid
            upcomingEvents={withCounts(upcomingEvents) as unknown as Event[]}
            pastEvents={withCounts(pastEvents) as unknown as Event[]}
            categories={(categories ?? []) as Category[]}
            initialType={type ?? ""}
            initialCategory={category ?? ""}
          />
        </Suspense>
      </section>
    </main>
  );
}
