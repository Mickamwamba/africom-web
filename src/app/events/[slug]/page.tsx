"use client";

import { useEffect, useState } from "react";
import { useParams, notFound } from "next/navigation";
import Image from "next/image";
import RegistrationModal from "@/components/events/RegistrationModal";

interface Category { id: string; name: string }
interface Event {
  id: string; title: string; slug: string; type: "event" | "training";
  category: Category | null; description: string;
  start_at: string; end_at: string; location: string; is_online: boolean;
  is_free: boolean; price: number | null; cover_image_url: string | null;
}

function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString("en-GB", {
    day: "numeric", month: "long", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

export default function EventDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    fetch(`/api/events/${slug}`)
      .then((res) => {
        if (!res.ok) return null;
        return res.json();
      })
      .then((data) => {
        setEvent(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading…</p>
      </main>
    );
  }

  if (!event) return notFound();

  const isPast = new Date(event.end_at) < new Date();

  return (
    <main className="min-h-screen bg-white">
      {/* Hero */}
      <div className="relative h-64 md:h-96 bg-gray-200">
        {event.cover_image_url ? (
          <Image
            src={event.cover_image_url}
            alt={event.title}
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div className="absolute inset-0 bg-brand-earth-brown/10 flex items-center justify-center">
            <span className="text-gray-400 text-6xl">📅</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-6 left-6 right-6">
          <span className="inline-block rounded-full bg-brand-earth-brown px-3 py-1 text-xs font-semibold text-white capitalize mb-2">
            {event.type}
          </span>
          <h1 className="text-2xl md:text-4xl font-bold text-white">{event.title}</h1>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-10">
        {/* Meta */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8 p-5 bg-gray-50 rounded-xl border border-gray-200">
          <MetaItem icon="📅" label="Start" value={formatDateTime(event.start_at)} />
          <MetaItem icon="🔚" label="End" value={formatDateTime(event.end_at)} />
          <MetaItem
            icon={event.is_online ? "💻" : "📍"}
            label={event.is_online ? "Mode" : "Location"}
            value={event.is_online ? "Online / Virtual" : event.location}
          />
          <MetaItem
            icon="💳"
            label="Price"
            value={event.is_free ? "Free" : event.price != null ? `$${event.price.toFixed(2)}` : "—"}
          />
          {event.category && (
            <MetaItem icon="🏷" label="Category" value={event.category.name} />
          )}
        </div>

        {/* Description */}
        <div
          className="prose prose-gray max-w-none mb-10"
          dangerouslySetInnerHTML={{ __html: event.description }}
        />

        {/* CTA */}
        {!isPast && (
          <button
            onClick={() => setModalOpen(true)}
            className="w-full sm:w-auto rounded-lg bg-brand-earth-brown px-8 py-4 text-base font-semibold text-white hover:opacity-90 transition-opacity"
          >
            Register Now
          </button>
        )}
        {isPast && (
          <p className="text-sm text-gray-500 italic">This event has already taken place.</p>
        )}
      </div>

      <RegistrationModal
        eventId={event.id}
        eventTitle={event.title}
        open={modalOpen}
        onOpenChange={setModalOpen}
      />
    </main>
  );
}

function MetaItem({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3">
      <span className="text-xl shrink-0">{icon}</span>
      <div>
        <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">{label}</p>
        <p className="text-sm text-gray-800 font-medium">{value}</p>
      </div>
    </div>
  );
}
