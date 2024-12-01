import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import ClientProviders from "@/provider/clientProviders";

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
  title: "LexTech AI",
  description: "An AI Assistant dedicated to case management",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // const session = await auth();
  return (
    <html lang="en">
      <body className={`antialiased`}>
        <ClientProviders>
          {/* <DashboardLayout> */}
          <main>{children}</main>
          {/* </DashboardLayout> */}
        </ClientProviders>

        <Toaster position="top-right" reverseOrder={false} />
      </body>
    </html>
  );
}
