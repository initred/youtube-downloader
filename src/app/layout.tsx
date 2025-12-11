import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

import favicon from "./favicon.png";
import { GridScan } from "@/components/grid-scan";

export const metadata: Metadata = {
  title: "YouTube Downloader",
  description: "Download YouTube videos as MP4 or MP3. Simple, fast, and free.",
  keywords: [
    "youtube",
    "downloader",
    "mp4",
    "mp3",
    "video",
    "audio",
    "convert",
  ],
  authors: [{ name: "YouTube Downloader" }],
  icons: {
    icon: favicon.src,
  },
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    title: "YouTube Downloader",
    description:
      "Download YouTube videos as MP4 or MP3. Simple, fast, and free.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary",
    title: "YouTube Downloader",
    description:
      "Download YouTube videos as MP4 or MP3. Simple, fast, and free.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-neutral-950 text-white`}
      >
        <div
          style={{
            zIndex: -1,
            width: "100%",
            height: "100vh",
            position: "fixed",
          }}
        >
          <GridScan
            sensitivity={0.55}
            lineThickness={2}
            linesColor="#392e4e"
            gridScale={0.1}
            scanColor="#FF9FFC"
            scanOpacity={0.1}
            enablePost
            bloomIntensity={1}
            chromaticAberration={0.02}
            noiseIntensity={0.05}
          />
        </div>
        {children}
      </body>
    </html>
  );
}
