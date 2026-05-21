"use client";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex items-center justify-center min-h-[400px] px-4">
      <div className="text-center max-w-md">
        <h2 className="text-xl font-bold text-gray-900 mb-2">Page error</h2>
        <p className="text-gray-500 text-sm mb-6">
          {error.message ?? "An unexpected error occurred in the admin dashboard."}
        </p>
        <button
          onClick={reset}
          className="rounded-lg border border-gray-300 px-5 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
        >
          Retry
        </button>
      </div>
    </div>
  );
}
