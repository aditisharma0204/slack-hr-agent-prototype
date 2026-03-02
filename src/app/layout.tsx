import type { Metadata } from "next";
import { Lato } from "next/font/google";
import { NuqsAdapter } from "nuqs/adapters/next";
import { Suspense } from "react";

import "./globals.css";

import { ConvexClientProvider } from "@/components/providers/ConvexClientProvider";
import { ConvexAuthNextjsServerProvider } from "@convex-dev/auth/nextjs/server";
import Modals from "@/components/modals";
import { Toaster } from "@/components/ui/sonner";
import JotaiProvider from "@/components/providers/JotaiProvider";
import { DemoDataProvider } from "@/context/DemoDataContext";

const lato = Lato({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
});

export const metadata: Metadata = {
  title: "Slack App Shell",
  description: "A reusable Slack App Shell boilerplate for designing new concepts.",
  icons: {
    icon: '/slackbot-logo.svg',
  },
};

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
const hasConvex = !!convexUrl && !convexUrl.includes("demo-disabled");

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const content = (
    <ConvexClientProvider>
      <JotaiProvider>
        <DemoDataProvider>
          <Suspense fallback={null}>
            <Toaster />
            {hasConvex && <Modals />}
            <NuqsAdapter>{children}</NuqsAdapter>
          </Suspense>
        </DemoDataProvider>
      </JotaiProvider>
    </ConvexClientProvider>
  );

  return (
    <html lang="en">
      <body className={lato.className}>
        {hasConvex ? (
          <ConvexAuthNextjsServerProvider>{content}</ConvexAuthNextjsServerProvider>
        ) : (
          content
        )}
      </body>
    </html>
  );
}
