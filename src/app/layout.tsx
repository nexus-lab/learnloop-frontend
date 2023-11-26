import { Inter } from "next/font/google";
import TransitionProvider from "@/components/TransitionProvider";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <TransitionProvider>
          <div className={inter.className + " w-full h-full"}>{children}</div>
        </TransitionProvider>
      </body>
    </html>
  );
}
