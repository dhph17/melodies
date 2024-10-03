import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Sidebar from "@/app/layout/sidebar/Sidebar";
import Footer from "@/app/layout/footer/Footer";
import Header from "@/app/layout/header/Header";

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
    <html lang="en">
      <body
        suppressHydrationWarning={true}
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-primaryColorBg flex text-white overflow-x-hidden`}
      >
        <Sidebar />
        <main className="ml-[20%] flex flex-col items-center">
          <Header />
          {children}
          <Footer />

        </main>

      </body>
    </html>
  );
}
