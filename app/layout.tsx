import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Waal afval- en reststromen projectscan",
  description:
    "Projectscan voor vrijkomende afval- en reststromen in woningbouwprojecten",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="nl">
      <body>{children}</body>
    </html>
  );
}
