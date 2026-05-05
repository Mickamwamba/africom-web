import type { Metadata } from "next";
import Button from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Page Not Found",
  description: "The page you are looking for does not exist.",
};

export default function NotFound() {
  return (
    <section className="section-padding container-lg text-center">
      <p className="text-6xl font-bold text-brand-earth-brown mb-4">404</p>
      <h1 className="text-3xl font-bold text-gray-900 mb-4">Page Not Found</h1>
      <p className="text-gray-600 mb-8 max-w-md mx-auto">
        The page you are looking for does not exist or may have been moved.
      </p>
      <Button href="/" variant="primary">
        Return to Homepage
      </Button>
    </section>
  );
}
