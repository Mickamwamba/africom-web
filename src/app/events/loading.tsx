import { EventCardSkeleton } from "@/components/events/EventCard";

export default function EventsLoading() {
  return (
    <section className="py-16 px-6 max-w-7xl mx-auto">
      <div className="mb-8 h-8 w-64 bg-gray-200 rounded animate-pulse" />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <EventCardSkeleton key={i} />
        ))}
      </div>
    </section>
  );
}
