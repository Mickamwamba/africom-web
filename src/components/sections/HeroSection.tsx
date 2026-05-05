import Image from "next/image";
import Button from "@/components/ui/Button";
import { company } from "@/content/company";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden min-h-[480px] flex items-center text-white">
      <Image
        src="/images/sections/hero.jpg"
        alt="Tanzanian grain fields at sunrise"
        fill
        className="object-cover"
        priority
      />
      <div className="absolute inset-0 bg-gradient-to-br from-black/65 to-black/30" />
      <div className="relative z-10 w-full">
        <div className="container-lg py-20 md:py-28">
          <div className="max-w-3xl">
            <p className="text-green-300 font-semibold text-sm uppercase tracking-widest mb-4">
              {company.usRegistrationStatus}
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              {company.tagline}
            </h1>
            <p className="text-green-100 text-lg md:text-xl leading-relaxed mb-8 max-w-2xl">
              {company.mission}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button href="/exports" variant="secondary" size="lg">
                View Export Products
              </Button>
              <Button
                href="/consultation"
                variant="outline"
                size="lg"
                className="border-white text-white hover:bg-white hover:text-brand-earth-brown"
              >
                Consultation Services
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
