import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { CartSidebar } from "@/components/cart/CartSidebar";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Coveplast - Cotizador",
  description: "Plataforma de cotización de productos plásticos",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${inter.variable} font-sans antialiased bg-[#eceef0] text-[#111827]`}>
        {/* Capa del logo gris como marca de agua encima del fondo */}
        <div
          aria-hidden="true"
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 0,
            backgroundImage: "url('/logo gris.svg')",
            backgroundRepeat: "repeat",
            backgroundSize: "200px auto",
            opacity: 0.15,
            pointerEvents: "none",
          }}
        />
        {/* Contenido principal sobre la capa del logo */}
        <div className="relative" style={{ zIndex: 1 }}>
          <Navbar />
          {children}
          <CartSidebar />
        </div>
      </body>
    </html>
  );
}
