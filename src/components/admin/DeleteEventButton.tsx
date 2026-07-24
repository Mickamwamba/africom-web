"use client";

export default function DeleteEventButton({
  action,
}: {
  action: () => Promise<void>;
}) {
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!confirm("Delete this event? This cannot be undone.")) {
          e.preventDefault();
        }
      }}
    >
      <button type="submit" className="text-red-500 hover:text-red-700">
        Delete
      </button>
    </form>
  );
}
