import Link from "next/link";
import Navigation from "./Navigation";

export default function Header() {
  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-100 shadow-sm">
      <div className="container-lg">
        <div className="flex items-center justify-between h-16 relative">
          <Link href="/" className="flex items-center gap-2" aria-label="Africom — Home">
            <span className="text-xl font-bold text-brand-green tracking-tight">
              Africom
            </span>
            <span className="hidden sm:block text-xs text-gray-500 border-l border-gray-300 pl-2 leading-tight">
              Agricultural<br />Exports & Consulting
            </span>
          </Link>

          <Navigation />
        </div>
      </div>
    </header>
  );
}
