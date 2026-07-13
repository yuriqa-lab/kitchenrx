import type { Metadata, Viewport } from "next";
import { headers } from "next/headers";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host") ?? "localhost:3000";
  const forwardedProtocol = requestHeaders.get("x-forwarded-proto");
  const protocol = forwardedProtocol ?? (host.startsWith("localhost") ? "http" : "https");
  const metadataBase = new URL(`${protocol}://${host}`);

  return {
    metadataBase,
    title: {
      default: "KitchenRx — Practical meal support",
      template: "%s · KitchenRx",
    },
    description:
      "A calm, care-oriented recipe and meal-support prototype by Yuriqa Lab.",
    openGraph: {
      title: "KitchenRx — Practical meal support",
      description:
        "Choose realistic meals for the energy, ingredients, and routines you have today.",
      type: "website",
      images: [{ url: "/og.png", width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: "KitchenRx — Practical meal support",
      description:
        "A care-oriented recipe and meal-support prototype by Yuriqa Lab.",
      images: ["/og.png"],
    },
  };
}

export const viewport: Viewport = {
  colorScheme: "light",
  themeColor: "#f4f0e6",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
