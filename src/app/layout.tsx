import type { Metadata } from "next";
import { Providers } from "@/components/providers";
import ErrorBoundary from "@/components/ErrorBoundary";
import "./globals.css";
// import "@/lib/i18n"; // Initialize i18n - temporarily disabled due to SSR issues

export const metadata: Metadata = {
  title: "Acrux - Strategic Objectives Dashboard",
  description: "Connect your team's well-being to business goals with real-time pulse checks and blocker management.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <ErrorBoundary>
          <Providers>
            {children}
          </Providers>
        </ErrorBoundary>
      </body>
    </html>
  );
}
