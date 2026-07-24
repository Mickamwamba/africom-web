"use client";

import { useState, useCallback } from "react";
import * as Tabs from "@radix-ui/react-tabs";
import EventCard, { EventCardSkeleton } from "./EventCard";
import EventFilters from "./EventFilters";

interface Category { id: string; name: string }
interface Event {
  id: string; slug: string; title: string; type: "event" | "training";
  category: Category | null; start_at: string; end_at: string;
  location: string; is_online: boolean; is_free: boolean;
  price: number | null; cover_image_url: string | null;
}

interface EventGridProps {
  upcomingEvents: Event[];
  pastEvents: Event[];
  categories: Category[];
  initialType?: string;
  initialCategory?: string;
}

export default function EventGrid({
  upcomingEvents, pastEvents: initialPastEvents, categories,
  initialType = "", initialCategory = "",
}: EventGridProps) {
  const [filters, setFilters] = useState({ type: initialType, category: initialCategory });
  const [pastEvents, setPastEvents] = useState<Event[]>(initialPastEvents);
  const [pastLoading, setPastLoading] = useState(false);
  const [pastLoaded, setPastLoaded] = useState(initialPastEvents.length > 0);

  const applyFilters = useCallback((events: Event[]) => {
    return events.filter((e) => {
      if (filters.type && e.type !== filters.type) return false;
      if (filters.category && e.category?.id !== filters.category) return false;
      return true;
    });
  }, [filters]);

  const filteredUpcoming = applyFilters(upcomingEvents);
  const filteredPast = applyFilters(pastEvents);

  async function handleTabChange(value: string) {
    if (value !== "past" || pastLoaded) return;
    setPastLoading(true);
    try {
      const params = new URLSearchParams({ view: "past", limit: "50" });
      const res = await fetch(`/api/events?${params}`);
      if (res.ok) {
        const body = await res.json();
        setPastEvents(body.data ?? []);
      }
    } finally {
      setPastLoading(false);
      setPastLoaded(true);
    }
  }

  return (
    <Tabs.Root defaultValue="upcoming" className="w-full" onValueChange={handleTabChange}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <Tabs.List className="flex rounded-lg border border-gray-200 bg-gray-50 p-1 w-fit">
          <Tabs.Trigger
            value="upcoming"
            className="rounded-md px-4 py-1.5 text-sm font-medium text-gray-600 data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm transition-all"
          >
            Upcoming
          </Tabs.Trigger>
          <Tabs.Trigger
            value="past"
            className="rounded-md px-4 py-1.5 text-sm font-medium text-gray-600 data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm transition-all"
          >
            Past
          </Tabs.Trigger>
        </Tabs.List>

        <EventFilters categories={categories} filters={filters} onFilterChange={setFilters} />
      </div>

      <Tabs.Content value="upcoming">
        <EventList events={filteredUpcoming} emptyMessage="No upcoming events at this time." />
      </Tabs.Content>

      <Tabs.Content value="past">
        {pastLoading ? (
          <SkeletonGrid />
        ) : (
          <EventList events={filteredPast} emptyMessage="No past events to show." />
        )}
      </Tabs.Content>
    </Tabs.Root>
  );
}

function SkeletonGrid() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <EventCardSkeleton key={i} />
      ))}
    </div>
  );
}

function EventList({ events, emptyMessage }: { events: Event[]; emptyMessage: string }) {
  if (events.length === 0) {
    return (
      <div className="py-20 text-center text-gray-500">
        <p className="text-lg">{emptyMessage}</p>
        <p className="text-sm mt-1">Check back soon for new events.</p>
      </div>
    );
  }
  return (
    <div
      data-testid="events-grid"
      className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
    >
      {events.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  );
}
