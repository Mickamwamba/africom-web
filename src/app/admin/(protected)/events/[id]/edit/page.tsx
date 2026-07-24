import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import EventForm from "@/components/admin/EventForm";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditEventPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: event }, { data: categories }] = await Promise.all([
    supabase.from("events").select("*").eq("id", id).single(),
    supabase.from("categories").select("id, name").order("name"),
  ]);

  if (!event) notFound();

  const initialData = {
    id: event.id,
    title: event.title,
    slug: event.slug,
    type: event.type as "event" | "training",
    category_id: event.category_id ?? "",
    description: event.description ?? "",
    start_at: event.start_at ? new Date(event.start_at).toISOString().slice(0, 16) : "",
    end_at: event.end_at ? new Date(event.end_at).toISOString().slice(0, 16) : "",
    location: event.location ?? "",
    is_online: event.is_online ?? false,
    is_free: event.is_free ?? true,
    price: event.price != null ? String(event.price) : "",
    cover_image_url: event.cover_image_url ?? null,
    status: event.status as "draft" | "published",
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit Event</h1>
      <EventForm categories={categories ?? []} initialData={initialData} mode="edit" />
    </div>
  );
}
