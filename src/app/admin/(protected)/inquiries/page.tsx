import { createClient } from "@/lib/supabase/server";
import InquiriesTable from "@/components/admin/InquiriesTable";

export default async function InquiriesPage() {
  const supabase = await createClient();
  const { data: inquiries } = await supabase
    .from("inquiries")
    .select("id, sender_name, email, service_of_interest, message, is_read, submitted_at")
    .order("submitted_at", { ascending: false });

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Inquiries</h1>
      <InquiriesTable initialInquiries={inquiries ?? []} />
    </div>
  );
}
