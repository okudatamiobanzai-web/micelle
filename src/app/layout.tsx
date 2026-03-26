import type { Metadata, Viewport } from "next";
import { BottomNav } from "@/components/ui/BottomNav";
import { AuthProvider } from "@/components/AuthProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "ミセル | milk共助プラットフォーム",
  description: "コワーキングスペースmilkのつながりから生まれた、道東の共助プラットフォーム",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className="h-full antialiased">
      <body className="min-h-full">
        <AuthProvider>
          <div className="max-w-[430px] mx-auto h-dvh flex flex-col bg-background relative shadow-[0_0_60px_rgba(0,0,0,.06)]">
            <main className="flex-1 overflow-y-auto pb-16">{children}</main>
            <BottomNav />
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
