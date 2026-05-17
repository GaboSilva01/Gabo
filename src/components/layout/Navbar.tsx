"use client";
import Link from "next/link";
import Image from "next/image";
import { useCartStore } from "@/store/useCartStore";
import { useEffect, useRef, useState } from "react";
import { Search, X, Menu, ShoppingCart, ChevronDown } from "lucide-react";
import { mockProducts } from "@/data/mockProducts";

export function Navbar() {
  const { items, openCart } = useCartStore();
  const cartItemCount = items.reduce((acc, item) => acc + item.quantity, 0);

  const [isVisible, setIsVisible] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const lastScrollY = useRef(0);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      setScrolled(currentY > 20);
      if (currentY > lastScrollY.current && currentY > 80) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      lastScrollY.current = currentY;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (searchOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 100);
    } else {
      setSearchQuery("");
    }
  }, [searchOpen]);

  const searchResults =
    searchQuery.trim().length > 0
      ? mockProducts.filter(
          (p) =>
            p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.description.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : [];

  return (
    <>
      {/* Placeholder que ocupa el espacio del header fijo */}
      <div className="w-full min-h-[80px] md:min-h-[140px]" aria-hidden="true" />

      <header
        className="w-full fixed top-0 left-0 right-0 z-50 min-h-[80px] md:min-h-[140px] flex items-center"
        style={{
          transform: isVisible ? "translateY(0)" : "translateY(-100%)",
          transition: "transform 0.35s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.3s ease",
          background: "rgba(10, 35, 66, 1)",
          backdropFilter: "blur(12px)",
          boxShadow: scrolled
            ? "0 4px 24px rgba(10,35,66,0.22)"
            : "none",
        }}
      >
        <div
          className="relative w-full max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between"
        >

          {/* Hamburger móvil */}
          <div className="flex-1 md:hidden">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 -ml-2 text-white/70 hover:text-white transition-colors"
              aria-label="Abrir menú"
            >
              <Menu size={24} />
            </button>
          </div>

          {/* Nav Desktop izquierda */}
          <nav className="hidden md:flex items-center gap-1 flex-1">
            <Link
              href="/"
              className="px-4 py-2 text-sm font-semibold text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200"
            >
              INICIO
            </Link>

            {/* Dropdown Catálogo */}
            <div className="relative group">
              <Link
                href="/catalogo"
                className="flex items-center gap-1 px-4 py-2 text-sm font-semibold text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200"
              >
                CATÁLOGO
                <ChevronDown
                  size={14}
                  className="transition-transform duration-200 group-hover:rotate-180"
                />
              </Link>
              <div className="absolute top-full left-0 mt-2 bg-white rounded-xl shadow-2xl border border-slate-100 py-2 w-44 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 translate-y-2 group-hover:translate-y-0">
                <Link
                  href="/catalogo#productos"
                  className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                >
                  🛍️ Productos
                </Link>
                <Link
                  href="/catalogo#servicios"
                  className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                >
                  ⚙️ Servicios
                </Link>
              </div>
            </div>
          </nav>

          {/* Logo centrado — mismo tamaño y posición que la versión original */}
          <Link
            href="/"
            className="absolute left-1/2 -translate-x-1/2 flex items-center"
          >
            <Image
              src="/logo.svg"
              alt="Coveplast"
              width={280}
              height={100}
              className="object-contain w-36 md:w-[280px] brightness-0 invert"
              priority
              unoptimized
            />
          </Link>

          {/* Acciones derecha */}
          <div className="flex flex-1 items-center justify-end gap-2 md:gap-3">
            <button
              onClick={() => setSearchOpen(true)}
              className="flex items-center gap-2 px-3 py-2 text-sm font-semibold text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200"
              aria-label="Buscar"
            >
              <Search size={18} />
              <span className="hidden md:inline text-sm">BUSCAR</span>
            </button>

            <a
              href="mailto:coveplast.comercializacion@gmail.com"
              className="hidden md:flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200"
            >
              CONTÁCTANOS
            </a>

            {/* Botón Carrito */}
            <button
              onClick={openCart}
              className="relative flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all duration-200"
              style={{
                background: "rgba(0, 119, 255, 0.15)",
                color: "#60A5FA",
                border: "1px solid rgba(0,119,255,0.3)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = "rgba(0,119,255,0.28)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = "rgba(0, 119, 255, 0.15)";
              }}
            >
              <ShoppingCart size={18} />
              <span className="hidden md:inline">CARRITO</span>
              {cartItemCount > 0 && (
                <span className="flex items-center justify-center w-5 h-5 rounded-full text-xs font-black text-white"
                  style={{ background: "#0077FF" }}>
                  {cartItemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Menú Móvil */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-[300] flex flex-col"
          style={{ background: "#0A2342" }}
        >
          <div className="flex justify-between items-center px-6 py-5 border-b border-white/10">
            <Image
              src="/logo.svg"
              alt="Coveplast"
              width={150}
              height={50}
              className="object-contain brightness-0 invert"
              unoptimized
            />
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 text-white/70 hover:text-white transition-colors"
            >
              <X size={26} />
            </button>
          </div>

          <nav className="flex flex-col px-6 py-8 gap-2">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="text-white font-semibold text-lg py-4 border-b border-white/10"
            >
              Inicio
            </Link>
            <div className="flex flex-col gap-1 border-b border-white/10 py-4">
              <span className="text-white/40 text-xs font-bold uppercase tracking-widest mb-2">
                Catálogo
              </span>
              <Link
                href="/catalogo#productos"
                onClick={() => setMobileMenuOpen(false)}
                className="text-white/80 hover:text-white font-medium text-base py-2 pl-3"
              >
                🛍️ Productos
              </Link>
              <Link
                href="/catalogo#servicios"
                onClick={() => setMobileMenuOpen(false)}
                className="text-white/80 hover:text-white font-medium text-base py-2 pl-3"
              >
                ⚙️ Servicios
              </Link>
            </div>
            <a
              href="mailto:coveplast.comercializacion@gmail.com"
              className="text-white/60 hover:text-white font-medium text-base py-4"
            >
              Contáctanos
            </a>
          </nav>
        </div>
      )}

      {/* Modal de búsqueda */}
      {searchOpen && (
        <div className="fixed inset-0 z-[200] flex flex-col items-center pt-16 bg-black/70 backdrop-blur-md px-4">
          <div className="bg-white rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden">
            <div className="flex items-center gap-3 px-5 py-4 border-b">
              <Search size={20} className="text-slate-400 shrink-0" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Buscar productos o servicios..."
                className="flex-1 text-base outline-none bg-transparent text-slate-800 placeholder:text-slate-400"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button
                onClick={() => setSearchOpen(false)}
                className="text-slate-400 hover:text-slate-800 transition-colors p-1"
              >
                <X size={20} />
              </button>
            </div>
            <div className="max-h-[60vh] overflow-y-auto">
              {searchQuery.trim() === "" ? (
                <p className="text-center text-slate-400 py-10 text-sm">
                  Escribe para buscar productos o servicios
                </p>
              ) : searchResults.length === 0 ? (
                <p className="text-center text-slate-400 py-10 text-sm">
                  Sin resultados para &quot;{searchQuery}&quot;
                </p>
              ) : (
                searchResults.map((product) => (
                  <button
                    key={product.id}
                    onClick={() => setSearchOpen(false)}
                    className="w-full flex items-center gap-4 px-5 py-3.5 hover:bg-slate-50 transition-colors text-left border-b border-slate-50 last:border-0"
                  >
                    <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center shrink-0 p-1">
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-full object-contain mix-blend-multiply"
                      />
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-slate-800">
                        {product.name}
                      </p>
                      <p className="text-slate-400 text-xs line-clamp-1 mt-0.5">
                        {product.description}
                      </p>
                    </div>
                    <span className="ml-auto text-xs font-bold text-blue-500 shrink-0">
                      Ver →
                    </span>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
