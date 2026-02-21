import type { Metadata } from "next";
import { Lato } from "next/font/google";
import { NuqsAdapter } from "nuqs/adapters/next";

import "./globals.css";

import { ConvexClientProvider } from "@/components/providers/ConvexClientProvider";
import { ConvexAuthNextjsServerProvider } from "@convex-dev/auth/nextjs/server";
import Modals from "@/components/modals";
import { Toaster } from "@/components/ui/sonner";
import JotaiProvider from "@/components/providers/JotaiProvider";
import { PresentationSceneProvider } from "@/context/PresentationSceneContext";
import { PrototypeModeProvider } from "@/context/PrototypeModeContext";
import { ArcNavigationProvider } from "@/context/ArcNavigationContext";
import { GlobalNavigationHeader } from "@/components/presentation/GlobalNavigationHeader";

const lato = Lato({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
});

export const metadata: Metadata = {
  title: "SlackbotPro",
  description: "Future of Selling - Evolving the CRM into an invisible, omnipresent layer",
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
        <PresentationSceneProvider>
          <PrototypeModeProvider>
            <ArcNavigationProvider>
              <Toaster />
              {hasConvex && <Modals />}
              {/* Global Navigation Header - rendered once at root level */}
              <GlobalNavigationHeader />
              <NuqsAdapter>{children}</NuqsAdapter>
            </ArcNavigationProvider>
          </PrototypeModeProvider>
        </PresentationSceneProvider>
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
