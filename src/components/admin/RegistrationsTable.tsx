"use client";

import { useState, useTransition } from "react";
import { createClient } from "@/lib/supabase/client";
import { downloadCsv } from "@/lib/csv";

interface Event { id: string; title: string }
interface Registration {
  id: string; full_name: string; email: string; phone: string;
  organisation: string | null; status: string; created_at: string;
  event: Event | null;
}

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  confirmed: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

interface RegistrationsTableProps {
  initialRegistrations: Registration[];
  events: Event[];
}

export default function RegistrationsTable({
  initialRegistrations, events,
}: RegistrationsTableProps) {
  const [registrations, setRegistrations] = useState(initialRegistrations);
  const [eventFilter, setEventFilter] = useState("");
  const [isPending, startTransition] = useTransition();

  const filtered = eventFilter
    ? registrations.filter((r) => r.event?.id === eventFilter)
    : registrations;

  async function updateStatus(id: string, newStatus: string) {
    startTransition(async () => {
      const supabase = createClient();
      const { error } = await supabase
        .from("registrations")
        .update({ status: newStatus })
        .eq("id", id);
      if (!error) {
        setRegistrations((prev) =>
          prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
        );
      }
    });
  }

  function handleExport() {
    downloadCsv(
      filtered.map((r) => ({
        name: r.full_name,
        email: r.email,
        phone: r.phone,
        organisation: r.organisation ?? "",
        event: r.event?.title ?? "",
        status: r.status,
        registered: new Date(r.created_at).toLocaleDateString("en-GB"),
      })),
      [
        { key: "name", label: "Full Name" },
        { key: "email", label: "Email" },
        { key: "phone", label: "Phone" },
        { key: "organisation", label: "Organisation" },
        { key: "event", label: "Event" },
        { key: "status", label: "Status" },
        { key: "registered", label: "Registered Date" },
      ],
      "registrations"
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <select
          value={eventFilter}
          onChange={(e) => setEventFilter(e.target.value)}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-earth-brown"
        >
          <option value="">All events</option>
          {events.map((e) => (
            <option key={e.id} value={e.id}>{e.title}</option>
          ))}
        </select>

        <button
          onClick={handleExport}
          className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
        >
          Export CSV
        </button>

        <span className="text-sm text-gray-500 ml-auto">{filtered.length} registration{filtered.length !== 1 ? "s" : ""}</span>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              {["Name", "Email", "Phone", "Organisation", "Event", "Status", "Date"].map((h) => (
                <th key={h} className="text-left px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wide">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.length === 0 ? (
              <tr><td colSpan={7} className="px-4 py-10 text-center text-gray-400">No registrations.</td></tr>
            ) : (
              filtered.map((reg) => (
                <tr key={reg.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">{reg.full_name}</td>
                  <td className="px-4 py-3 text-gray-600">{reg.email}</td>
                  <td className="px-4 py-3 text-gray-600">{reg.phone}</td>
                  <td className="px-4 py-3 text-gray-500">{reg.organisation ?? "—"}</td>
                  <td className="px-4 py-3 text-gray-600 max-w-xs truncate">{reg.event?.title ?? "—"}</td>
                  <td className="px-4 py-3">
                    <select
                      value={reg.status}
                      onChange={(e) => updateStatus(reg.id, e.target.value)}
                      disabled={isPending}
                      className={`rounded-full px-2.5 py-0.5 text-xs font-semibold border-0 focus:outline-none focus:ring-2 focus:ring-brand-earth-brown cursor-pointer ${STATUS_COLORS[reg.status] ?? "bg-gray-100 text-gray-600"}`}
                    >
                      <option value="pending">pending</option>
                      <option value="confirmed">confirmed</option>
                      <option value="cancelled">cancelled</option>
                    </select>
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-xs">
                    {new Date(reg.created_at).toLocaleDateString("en-GB")}
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
