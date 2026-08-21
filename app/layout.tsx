import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: "Counted — Blackjack Trainer",
  description: "Learn Hi-Lo card counting and blackjack basic strategy with focused drills.",
  applicationName: "Counted",
  manifest: "/trainer/manifest.webmanifest",
  icons: {
    icon: "/trainer/assets/icon.svg",
    apple: "/trainer/assets/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#111312",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
