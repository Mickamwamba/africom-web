import Link from "next/link";
import { company } from "@/content/company";
import Logo from "@/components/ui/Logo";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container-lg py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <Logo variant="white" width={140} height={42} className="mb-2" />
            <p className="text-sm leading-relaxed text-gray-400">
              {company.tagline}
            </p>
            <p className="text-xs text-gray-500 mt-3">{company.usRegistrationStatus}</p>
          </div>

          {/* Quick links */}
          <div>
            <p className="text-white font-semibold mb-3 text-sm uppercase tracking-wide">
              Quick Links
            </p>
            <ul className="space-y-2 text-sm">
              {[
                { href: "/exports", label: "Export Products" },
                { href: "/consultation", label: "Consultation Services" },
                { href: "/about", label: "About Africom" },
                { href: "/contact", label: "Contact Us" },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="hover:text-brand-organic-green transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p className="text-white font-semibold mb-3 text-sm uppercase tracking-wide">
              Get in Touch
            </p>
            <div className="space-y-2 text-sm">
              {company.contactEmail && (
                <p>
                  <a
                    href={`mailto:${company.contactEmail}`}
                    className="hover:text-brand-organic-green transition-colors"
                  >
                    {company.contactEmail}
                  </a>
                </p>
              )}
              {company.contactPhone && (
                <p>
                  <a
                    href={`tel:${company.contactPhone}`}
                    className="hover:text-brand-organic-green transition-colors"
                  >
                    {company.contactPhone}
                  </a>
                </p>
              )}
              {company.headquartersAddress && (
                <p className="text-gray-500 text-xs">{company.headquartersAddress}</p>
              )}
            </div>

            {/* Social links — rendered only if accounts exist */}
            {company.socialLinks.length > 0 && (
              <div className="flex gap-3 mt-4">
                {company.socialLinks.map(({ platform, url }) => (
                  <a
                    key={platform}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs uppercase tracking-wide hover:text-brand-organic-green transition-colors"
                    aria-label={platform}
                  >
                    {platform}
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="border-t border-gray-800 mt-10 pt-6 text-xs text-gray-600 text-center">
          © {year} {company.legalName}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
