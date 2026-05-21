import Link from "next/link";
import Image from "next/image";

interface Category {
  id: string;
  name: string;
}

interface Event {
  id: string;
  slug: string;
  title: string;
  type: "event" | "training";
  category: Category | null;
  start_at: string;
  end_at: string;
  location: string;
  is_online: boolean;
  is_free: boolean;
  price: number | null;
  cover_image_url: string | null;
  registration_count?: number;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatPrice(is_free: boolean, price: number | null): string {
  if (is_free) return "Free";
  if (price != null) return `$${price.toFixed(2)}`;
  return "—";
}

export function EventCardSkeleton() {
  return (
    <div className="flex flex-col rounded-xl border border-gray-200 bg-white overflow-hidden shadow-sm animate-pulse">
      <div className="h-44 bg-gray-200" />
      <div className="flex flex-col flex-1 p-4 gap-3">
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="h-3 bg-gray-200 rounded w-1/3" />
        <div className="mt-auto pt-3 flex items-center justify-between">
          <div className="h-3 bg-gray-200 rounded w-24" />
          <div className="h-3 bg-gray-200 rounded w-12" />
        </div>
      </div>
    </div>
  );
}

export default function EventCard({ event }: { event: Event }) {
  return (
    <Link
      href={`/events/${event.slug}`}
      data-testid="event-card"
      className="group flex flex-col rounded-xl border border-gray-200 bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="relative h-44 bg-gray-100">
        {event.cover_image_url ? (
          <Image
            src={event.cover_image_url}
            alt={event.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-gray-300">
            <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
        <span className="absolute top-3 left-3 rounded-full bg-brand-earth-brown px-2.5 py-0.5 text-xs font-semibold text-white capitalize">
          {event.type}
        </span>
      </div>

      <div className="flex flex-col flex-1 p-4 gap-2">
        <h3 className="font-semibold text-gray-900 line-clamp-2 group-hover:text-brand-earth-brown transition-colors">
          {event.title}
        </h3>

        {event.category && (
          <p className="text-xs text-gray-500">{event.category.name}</p>
        )}

        <div className="mt-auto pt-3 flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center gap-1.5">
            <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>{formatDate(event.start_at)}</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">
              {event.is_online ? "Online" : "In person"}
            </span>
            <span className="font-semibold text-brand-earth-brown">
              {formatPrice(event.is_free, event.price)}
            </span>
          </div>
        </div>

        {(event.registration_count ?? 0) > 0 && (
          <div className="flex items-center gap-1.5 px-4 pb-3 text-xs text-gray-500">
            <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a4 4 0 00-5-9.9M9 20H4v-2a4 4 0 015-9.9m6 0a4 4 0 10-6 0" />
            </svg>
            {event.registration_count} registered
          </div>
        )}
      </div>
    </Link>
  );
}
