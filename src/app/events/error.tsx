"use client";

export default function EventsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Something went wrong</h2>
        <p className="text-gray-500 mb-6">
          We couldn&apos;t load the events page. Please try again.
        </p>
        <button
          onClick={reset}
          className="rounded-lg bg-brand-earth-brown px-6 py-2.5 text-sm font-semibold text-white hover:opacity-90"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
