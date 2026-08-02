const normalizeUrl = (value: string) => value.replace(/\/+$/, "");

const fromEnv =
  process.env.NEXT_PUBLIC_SITE_URL ||
  process.env.VERCEL_PROJECT_PRODUCTION_URL ||
  process.env.VERCEL_URL;

const withProtocol = (value: string) =>
  value.startsWith("http://") || value.startsWith("https://")
    ? value
    : `https://${value}`;

export const siteUrl = normalizeUrl(
  fromEnv ? withProtocol(fromEnv) : "http://localhost:3000",
);

export const siteName = "Road Accident Video Speed Analysis";
export const siteDescription =
  "AI-powered preliminary speed estimation from road accident video footage.";