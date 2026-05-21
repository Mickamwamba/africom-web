"use client";

import { useState, useTransition } from "react";
import { createClient } from "@/lib/supabase/client";

interface Inquiry {
  id: string;
  sender_name: string;
  email: string;
  service_of_interest: string | null;
  message: string;
  is_read: boolean;
  submitted_at: string;
}

const SERVICE_LABELS: Record<string, string> = {
  export: "Export Products",
  consultation: "Consultation",
  other: "General Inquiry",
};

interface InquiriesTableProps {
  initialInquiries: Inquiry[];
}

export default function InquiriesTable({ initialInquiries }: InquiriesTableProps) {
  const [inquiries, setInquiries] = useState(initialInquiries);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  async function toggleRead(id: string, current: boolean) {
    startTransition(async () => {
      const supabase = createClient();
      const { error } = await supabase
        .from("inquiries")
        .update({ is_read: !current })
        .eq("id", id);
      if (!error) {
        setInquiries((prev) =>
          prev.map((i) => (i.id === id ? { ...i, is_read: !current } : i))
        );
      }
    });
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            {["", "Sender", "Email", "Service", "Message", "Date", "Action"].map((h) => (
              <th key={h} className="text-left px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wide">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {inquiries.length === 0 ? (
            <tr><td colSpan={7} className="px-4 py-10 text-center text-gray-400">No inquiries yet.</td></tr>
          ) : (
            inquiries.map((inq) => (
              <>
                <tr
                  key={inq.id}
                  className={`hover:bg-gray-50 cursor-pointer ${!inq.is_read ? "bg-blue-50/40 font-medium" : ""}`}
                  onClick={() => setExpanded(expanded === inq.id ? null : inq.id)}
                >
                  <td className="px-4 py-3">
                    {!inq.is_read && (
                      <span className="block w-2 h-2 rounded-full bg-blue-500" title="Unread" />
                    )}
                  </td>
                  <td className="px-4 py-3 text-gray-900">{inq.sender_name}</td>
                  <td className="px-4 py-3 text-gray-600">{inq.email}</td>
                  <td className="px-4 py-3 text-gray-500 text-xs">
                    {inq.service_of_interest ? (SERVICE_LABELS[inq.service_of_interest] ?? inq.service_of_interest) : "—"}
                  </td>
                  <td className="px-4 py-3 text-gray-600 max-w-xs truncate">
                    {inq.message.slice(0, 60)}{inq.message.length > 60 ? "…" : ""}
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-xs">
                    {new Date(inq.submitted_at).toLocaleDateString("en-GB")}
                  </td>
                  <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => toggleRead(inq.id, inq.is_read)}
                      disabled={isPending}
                      className="text-xs text-blue-600 hover:text-blue-800 whitespace-nowrap"
                    >
                      {inq.is_read ? "Mark as unread" : "Mark as read"}
                    </button>
                  </td>
                </tr>
                {expanded === inq.id && (
                  <tr key={`${inq.id}-expanded`} className="bg-gray-50">
                    <td colSpan={7} className="px-6 py-4">
                      <p className="text-sm text-gray-700 whitespace-pre-wrap">{inq.message}</p>
                    </td>
                  </tr>
                )}
              </>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
