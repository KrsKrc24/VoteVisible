import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "VoteVisible: Healthcare Legislation, Translated",
  description:
    "VoteVisible translates state healthcare legislation into plain language and gives people from every background a direct way to contact their representatives about the laws shaping their communities.",
  other: {
    // Discourage native auto-translation; bill translations use an isolated reader.
    google: "notranslate",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <a
          href="#main-content"
          className="sr-only fixed left-4 top-4 z-[200] rounded-none bg-blue-600 px-5 py-3 text-white focus:not-sr-only"
        >
          Skip to content
        </a>
        <Navbar />
        <main id="main-content" className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
