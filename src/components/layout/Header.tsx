import Link from "next/link";
import Navigation from "./Navigation";
import Logo from "@/components/ui/Logo";

export default function Header() {
  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-100 shadow-sm">
      <div className="container-lg">
        <div className="flex items-center justify-between h-16 relative">
          <Link href="/" aria-label="Africom International Ltd — Home">
            <Logo variant="full-color" width={160} height={48} />
          </Link>

          <Navigation />
        </div>
      </div>
    </header>
  );
}
