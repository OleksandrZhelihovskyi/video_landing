import { HomePageClient } from "./home-page-client";
import { Providers } from "./providers";
import { ContextProvider } from "./Context";
import type { Metadata } from "next";
import { siteName, siteUrl } from "./site-config";

export const metadata: Metadata = {
  title: "Vehicle Speed Estimation from Video",
  description:
    "Upload road accident footage and get an AI-powered preliminary vehicle speed estimate.",
  keywords: [
    "vehicle speed estimation",
    "road accident video analysis",
    "accident footage speed",
    "AI traffic video analysis",
    "preliminary forensic speed check",
  ],
  openGraph: {
    title: "Vehicle Speed Estimation from Video",
    description:
      "AI-powered preliminary vehicle speed estimation from road accident footage.",
    url: "/",
    siteName,
    type: "website",
    images: [
      {
        url: "/logo2.png",
        width: 1200,
        height: 630,
        alt: "Vehicle speed estimation service",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Vehicle Speed Estimation from Video",
    description:
      "Upload accident footage and get an AI-powered preliminary speed estimate.",
    images: ["/logo2.png"],
  },
  alternates: {
    canonical: "/",
  },
};

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Road Accident Video Speed Analysis",
  serviceType: "AI-assisted video speed estimation",
  provider: {
    "@type": "Organization",
    name: siteName,
    url: siteUrl,
  },
  areaServed: {
    "@type": "Place",
    name: "Worldwide",
  },
  description:
    "Preliminary vehicle speed estimation from road accident footage using AI analysis.",
  url: siteUrl,
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "When do you need this service?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "This service is useful when you need a preliminary vehicle speed estimate from road accident footage before official forensic examination.",
      },
    },
    {
      "@type": "Question",
      name: "How does the analysis work?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The system analyzes video frame by frame, tracks vehicle movement between reference points, and estimates speed using displacement and calibration parameters.",
      },
    },
    {
      "@type": "Question",
      name: "How much does it cost?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Payment is charged only when a usable speed estimate is produced from the uploaded footage.",
      },
    },
  ],
};

export default function Home() {
  return (
    <Providers>
      <ContextProvider>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
        <HomePageClient />
      </ContextProvider>
    </Providers>
  );
}
