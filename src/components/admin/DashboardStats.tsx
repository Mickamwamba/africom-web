interface StatCard {
  label: string;
  value: number;
  icon: string;
  color: string;
}

interface DashboardStatsProps {
  totalEvents: number;
  upcomingEvents: number;
  totalRegistrations: number;
  unreadInquiries: number;
}

export default function DashboardStats({
  totalEvents, upcomingEvents, totalRegistrations, unreadInquiries,
}: DashboardStatsProps) {
  const stats: StatCard[] = [
    { label: "Total Events", value: totalEvents, icon: "📅", color: "bg-blue-50 text-blue-700" },
    { label: "Upcoming Events", value: upcomingEvents, icon: "⏰", color: "bg-green-50 text-green-700" },
    { label: "Total Registrations", value: totalRegistrations, icon: "📋", color: "bg-amber-50 text-amber-700" },
    { label: "Unread Inquiries", value: unreadInquiries, icon: "✉", color: "bg-purple-50 text-purple-700" },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
      {stats.map(({ label, value, icon, color }) => (
        <div key={label} className="rounded-xl border border-gray-200 bg-white p-5 flex items-center gap-4 shadow-sm">
          <span className={`text-3xl flex items-center justify-center w-12 h-12 rounded-xl ${color}`}>
            {icon}
          </span>
          <div>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            <p className="text-sm text-gray-500">{label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
