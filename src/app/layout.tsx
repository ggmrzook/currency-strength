import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Currency Strength — Real Economic Comparison",
  description:
    "Compare the real strength of any two world currencies using GDP, purchasing power, inflation, salary, and exchange rate data.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ backgroundColor: "#0A0A0F", color: "#E8E8F0" }}>
        {children}
      </body>
    </html>
  );
}
