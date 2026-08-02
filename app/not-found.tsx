import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Page Not Found",
  description:
    "The requested page was not found. Return to the main page to continue video speed analysis.",
  robots: {
    index: false,
    follow: true,
  },
};

export default function NotFound() {
  return (
    <main className="flex min-h-[70vh] items-center justify-center px-4 py-16">
      <div className="w-full max-w-xl rounded-3xl border border-white/10 bg-white/[0.04] p-8 text-center shadow-[0_20px_60px_rgba(0,0,0,0.3)] backdrop-blur-sm">
        <p className="text-xs font-bold uppercase tracking-[0.24em] text-amber-300">
          404
        </p>
        <h1 className="mt-3 text-3xl font-semibold text-white">Page not found</h1>
        <p className="mt-3 text-sm leading-6 text-white/70 md:text-base">
          The page you are looking for does not exist or may have been moved.
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex rounded-full border border-amber-300/40 bg-amber-300/10 px-5 py-2.5 text-sm font-semibold text-amber-200 transition hover:border-amber-300/70 hover:bg-amber-300/20"
        >
          Back to home
        </Link>
      </div>
    </main>
  );
}