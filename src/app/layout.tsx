import type { Metadata } from "next";
import { Fraunces, Manrope } from "next/font/google";
import { ToastProvider } from "@/components/Toast";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

export const metadata: Metadata = {
  title: "IndexHomes — Virtual Property Trading",
  description:
    "Buy virtual plots against a unified live price index. Secure ownership records, Stripe payments, and role-based dashboards.",
  icons: {
    icon: [
      { url: "/favicon.png", type: "image/png", sizes: "32x32" },
      { url: "/favicon.ico", sizes: "any" },
      { url: "/images/brand/favicon-mark.png", type: "image/png", sizes: "256x256" },
    ],
    apple: [{ url: "/images/brand/favicon-mark.png", sizes: "180x180" }],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-GB">
      <body className={`${fraunces.variable} ${manrope.variable} antialiased`}>
        <ToastProvider>
          <div className="atmosphere min-h-screen">{children}</div>
        </ToastProvider>
      </body>
    </html>
  );
}
