"use client";
import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { SessionProvider } from "next-auth/react";
import { auth } from "./api/auth/[...nextauth]/auth";
import { Toaster } from "react-hot-toast";
import { QueryClientProvider } from "react-query";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { persistor, Store } from "@/states/store";
import { queryClient } from "@/config";
import DashboardLayout from "@/shared/Layouts/DashboardLayout";

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

const metadata: Metadata = {
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
        <PersistGate persistor={persistor}>
          <Provider store={Store}>
            <QueryClientProvider client={queryClient}>
              <SessionProvider>
                {/* <DashboardLayout> */}
                <main>{children}</main>
                {/* </DashboardLayout> */}
              </SessionProvider>
            </QueryClientProvider>
          </Provider>
        </PersistGate>
        <Toaster position="top-right" reverseOrder={false} />
      </body>
    </html>
  );
}
