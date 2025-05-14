import type { Metadata } from "next";
import "@/src/styles/globals.scss";
import Layout from "../components/common/Layout";
import { ModalsProvider } from "../components/ui/ModalsProvider/ModalsProvider";
import RootProvider from "./provider";
import QueryProvider from "../components/providers/QueryProvider";
import ToastProvider from "../components/ui/Toast/ToastProvider";

export const metadata: Metadata = {
  title: "Winnr – Fantasy Contests for Crypto Narratives",
  description:
    "Winnr is a fantasy-style contest platform where you compete on crypto narratives, memes, and tokens.",
  metadataBase: new URL("https://app.winnr.fun"),
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Winnr",
    title: "Winnr – Fantasy Contests for Crypto Narratives",
    description:
      "Winnr is a fantasy-style contest platform where you compete on crypto narratives, memes, and tokens.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Winnr – Fantasy Contests for Crypto Narratives",
    description:
      "YourWinnr is a fantasy-style contest platform where you compete on crypto narratives, memes, and tokens.",
    creator: "@winnrdotfun",
  },
  robots: {
    index: true,
    follow: true,
  },
  keywords: ["winnr", "waitlist", "waitlist is live", "waitlist is open"],
  other: {
    "telegram:image": "https://app.winnr.fun/og.png",
    "og:image": "https://app.winnr.fun/og.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body className={`bg-base-black antialiased`}>
        <QueryProvider>
          <RootProvider>
            <ModalsProvider>
              <Layout>{children}</Layout>
              <ToastProvider />
            </ModalsProvider>
          </RootProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
