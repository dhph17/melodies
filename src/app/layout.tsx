import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { SongProvider } from "@/components/provider/songProvider";
import { ScrollProvider } from "@/components/provider/scrollProvider";
import { Toaster } from "@/components/ui/toaster"
import { AppProvider } from "@/app/AppProvider";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body
        suppressHydrationWarning={true}
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-primaryColorBg flex overflow-hidden text-white`}
      >
        <AppProvider>
          <Toaster />
          <ScrollProvider>
            <SongProvider>
              <main className="">{children}</main>
            </SongProvider>
          </ScrollProvider>
        </AppProvider>

      </body>
    </html>
  );
}
