import type { Metadata } from "next";
import { Providers } from "@/components/providers";
import ErrorBoundary from "@/components/ErrorBoundary";
import "./globals.css";
import ClientProviders from "@/components/ClientProviders";

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
          <ClientProviders>
            <Providers>
              {children}
            </Providers>
          </ClientProviders>
        </ErrorBoundary>
      </body>
    </html>
  );
}
