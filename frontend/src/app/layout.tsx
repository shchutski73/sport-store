import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "./contexts/AuthContext";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SportStore - Интернет-магазин спортивных товаров",
  description: "Современный интернет-магазин спортивных товаров. Широкий ассортимент качественной продукции для активного образа жизни. Доставка по всей стране.",
  keywords: "спортивные товары, интернет-магазин, спорт, экипировка, аксессуары",
  openGraph: {
    title: "SportStore - Интернет-магазин спортивных товаров",
    description: "Современный интернет-магазин спортивных товаров. Широкий ассортимент качественной продукции.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <Navbar />
          <main>{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
