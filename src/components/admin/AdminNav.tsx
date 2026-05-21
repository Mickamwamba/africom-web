"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/admin", label: "Dashboard", icon: "⊞" },
  { href: "/admin/events", label: "Events", icon: "📅" },
  { href: "/admin/categories", label: "Categories", icon: "🏷" },
  { href: "/admin/registrations", label: "Event Registrations", icon: "📋" },
  { href: "/admin/inquiries", label: "Inquiries", icon: "✉" },
] as const;

export default function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="w-56 shrink-0 bg-gray-900 min-h-screen flex flex-col">
      <div className="px-5 py-6 border-b border-gray-700">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Africom</p>
        <p className="text-sm text-white font-medium mt-0.5">Admin Dashboard</p>
      </div>

      <ul className="flex-1 px-3 py-4 space-y-1">
        {NAV_ITEMS.map(({ href, label, icon }) => {
          const isActive =
            href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
          return (
            <li key={href}>
              <Link
                href={href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-gray-700 text-white"
                    : "text-gray-400 hover:bg-gray-800 hover:text-white"
                }`}
              >
                <span className="text-base">{icon}</span>
                {label}
              </Link>
            </li>
          );
        })}
      </ul>

      <div className="px-3 py-4 border-t border-gray-700">
        <form action="/api/auth/signout" method="post">
          <button
            type="submit"
            className="w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-400 hover:bg-gray-800 hover:text-white transition-colors"
          >
            <span className="text-base">↩</span>
            Sign out
          </button>
        </form>
      </div>
    </nav>
  );
}
