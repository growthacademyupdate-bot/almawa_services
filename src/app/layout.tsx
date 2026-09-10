import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "../styles.css";
import { ClientLayout } from "./client-layout";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
});

export const metadata: Metadata = {
  title:
    "Almawa Services — Business Consulting, Incorporation & Fund Raising",

  description:
    "Pan-India business consulting for startups and MSMEs — incorporation, certifications, company profiling, fund raising and digital marketing.",

  authors: [{ name: "Almawa Services" }],

  openGraph: {
    title:
      "Almawa Services — Business Consulting, Incorporation & Fund Raising",

    description:
      "Pan-India business consulting for startups and MSMEs — incorporation, certifications, company profiling, fund raising and digital marketing.",

    type: "website",

    images: [
      "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/f27f66d0-bc24-4cca-84b7-7acca27f453f/id-preview-9b5592bd--c7ec9878-211d-4256-aa96-ab8575d892cc.lovable.app-1783501275333.png",
    ],
  },

  twitter: {
    card: "summary_large_image",

    title:
      "Almawa Services — Business Consulting, Incorporation & Fund Raising",

    description:
      "Pan-India business consulting for startups and MSMEs — incorporation, certifications, company profiling, fund raising and digital marketing.",

    images: [
      "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/f27f66d0-bc24-4cca-84b7-7acca27f453f/id-preview-9b5592bd--c7ec9878-211d-4256-aa96-ab8575d892cc.lovable.app-1783501275333.png",
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jakarta.variable}`}
    >
      <body className="antialiased" suppressHydrationWarning>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}