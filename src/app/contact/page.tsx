import type { Metadata } from "next";
import InquiryForm from "@/components/ui/InquiryForm";
import { company } from "@/content/company";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with Africom for export product inquiries or agricultural development consultation. Submit your inquiry and we will respond within 2 business days.",
};

export default function ContactPage() {
  return (
    <div className="section-padding">
      <div className="container-lg">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Contact Us</h1>
          <p className="text-gray-600 mb-8 text-lg">
            Whether you are looking to source Tanzanian agricultural products or need a
            consultation partner for your development programme, we want to hear from you.
          </p>

          {/* Contact details */}
          <div className="bg-brand-cream rounded-xl p-6 mb-8 flex flex-col sm:flex-row gap-6">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                Email
              </p>
              <a
                href={`mailto:${company.contactEmail}`}
                className="text-brand-green font-medium hover:underline"
              >
                {company.contactEmail}
              </a>
            </div>
            {company.contactPhone && (
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                  Phone
                </p>
                <a
                  href={`tel:${company.contactPhone}`}
                  className="text-brand-green font-medium hover:underline"
                >
                  {company.contactPhone}
                </a>
              </div>
            )}
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                Address
              </p>
              <p className="text-gray-700 text-sm">{company.headquartersAddress}</p>
            </div>
          </div>

          <InquiryForm />
        </div>
      </div>
    </div>
  );
}
