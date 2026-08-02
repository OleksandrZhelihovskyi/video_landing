import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About the Service",
  description:
    "Learn about our AI-based preliminary vehicle speed analysis from road accident footage.",
  keywords: [
    "about video speed analysis",
    "road accident AI service",
    "vehicle speed estimation platform",
  ],
  openGraph: {
    title: "About the Service",
    description:
      "Learn how our AI-assisted workflow provides preliminary speed estimates from road accident videos.",
    url: "/about",
    type: "article",
  },
  alternates: {
    canonical: "/about",
  },
};

export default function AboutPage() {
  return <h1>About us</h1>;
}