"use client";
import Link from "next/link";
import Image from "next/image";
import { useCartStore } from "@/store/useCartStore";
import { useEffect, useRef, useState } from "react";
import { Search, X, Menu, ShoppingCart } from "lucide-react";
import { mockProducts } from "@/data/mockProducts";

export function Navbar() {
  const { items, openCart } = useCartStore();
  const cartItemCount = items.reduce((acc, item) => acc + item.quantity, 0);

  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);
  const [showLogo, setShowLogo] = useState(true);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      setShowLogo(currentY <= 50);
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

  const searchResults = searchQuery.trim().length > 0
    ? mockProducts.filter((p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
    : [];

  return (
    <>
      <header
        className="w-full bg-white border-b border-gray-200 px-4 md:px-8 sticky top-0 z-50 transition-transform duration-300 min-h-[80px] md:min-h-[140px] flex items-center"
        style={{
          transform: isVisible ? "translateY(0)" : "translateY(-100%)",
        }}
      >
        {/* Fondo: logo gris a 5% de opacidad */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: "url('/logo gris.svg')",
            backgroundRepeat: "repeat",
            backgroundSize: "160px auto",
            opacity: 0.05,
            pointerEvents: "none",
          }}
        />

        <div className="relative w-full max-w-7xl mx-auto flex items-center justify-between">
          
          {/* Menu Hamburger para Móvil */}
          <div className="flex-1 md:hidden">
            <button 
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 -ml-2 text-gray-500 hover:text-black transition-colors"
              aria-label="Abrir menú"
            >
              <Menu size={24} />
            </button>
          </div>

          {/* Navegación Desktop */}
          <nav className="hidden md:flex flex-1 items-center gap-8 text-sm font-medium tracking-wide">
            <Link href="/" className="text-black hover:text-gray-600 transition-colors">INICIO</Link>
            
            <div className="relative group py-4 cursor-pointer">
              <Link href="/catalogo" className="text-gray-500 group-hover:text-black transition-colors flex items-center gap-1">
                CATÁLOGO <span className="text-xs transition-transform duration-200 group-hover:rotate-180">▼</span>
              </Link>
              
              <div className="absolute top-full left-0 mt-0 bg-white shadow-xl rounded-xl border border-gray-100 py-3 w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                <Link 
                  href="/catalogo#productos" 
                  className="block px-5 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-50 hover:text-black transition-colors"
                >
                  Productos
                </Link>
                <Link 
                  href="/catalogo#servicios" 
                  className="block px-5 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-50 hover:text-black transition-colors"
                >
                  Servicios
                </Link>
              </div>
            </div>
          </nav>

          {/* Logo Centrado */}
          <Link
            href="/"
            className={`absolute left-1/2 -translate-x-1/2 flex items-center transition-all duration-300 ${showLogo ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 pointer-events-none"
              }`}
          >
            <Image src="/logo.svg" alt="Coveplast Logo" width={280} height={100} className="object-contain w-36 md:w-[280px]" priority unoptimized />
          </Link>

          {/* Acciones Derecha (Buscar, Contacto, Carrito) */}
          <div className="flex flex-1 items-center justify-end gap-3 md:gap-6 text-sm font-medium tracking-wide">
            <button
              onClick={() => setSearchOpen(true)}
              className="flex items-center gap-2 text-gray-500 hover:text-black transition-colors p-2 md:p-0"
              aria-label="Abrir buscador"
            >
              <Search size={20} className="md:w-4 md:h-4" />
              <span className="hidden md:inline">BUSCAR</span>
            </button>
            
            <a
              href="mailto:coveplast.comercializacion@gmail.com"
              className="hidden md:flex items-center gap-1 text-gray-500 hover:text-black transition-colors"
              title="coveplast.comercializacion@gmail.com"
            >
              CONTÁCTANOS
            </a>
            
            <button
              onClick={openCart}
              className="flex items-center gap-1.5 md:gap-2 text-black hover:text-gray-600 transition-colors bg-gray-100 px-3 py-2 md:px-4 md:py-2 rounded-full"
            >
              <ShoppingCart size={18} className="md:hidden" />
              <span className="hidden md:inline">CARRITO</span>
              <span className="font-bold">({cartItemCount})</span>
            </button>
          </div>
        </div>
      </header>

      {/* Menú Móvil */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[300] bg-white flex flex-col p-6">
          <div className="flex justify-between items-center mb-10">
            <Image src="/logo.svg" alt="Coveplast Logo" width={160} height={60} className="object-contain" unoptimized />
            <button onClick={() => setMobileMenuOpen(false)} className="p-2 -mr-2 text-gray-500 hover:text-black">
              <X size={28} />
            </button>
          </div>
          
          <nav className="flex flex-col gap-6 text-lg font-medium tracking-wide">
            <Link href="/" onClick={() => setMobileMenuOpen(false)} className="text-black border-b border-gray-100 pb-4">INICIO</Link>
            <div className="flex flex-col gap-4 border-b border-gray-100 pb-4">
              <span className="text-gray-400 text-sm">CATÁLOGO</span>
              <Link href="/catalogo#productos" onClick={() => setMobileMenuOpen(false)} className="text-black pl-4">Productos</Link>
              <Link href="/catalogo#servicios" onClick={() => setMobileMenuOpen(false)} className="text-black pl-4">Servicios</Link>
            </div>
            <a href="mailto:coveplast.comercializacion@gmail.com" className="text-gray-500 pt-4">Contáctanos</a>
          </nav>
        </div>
      )}

      {/* Modal de búsqueda */}
      {searchOpen && (
        <div className="fixed inset-0 z-[200] flex flex-col items-center pt-20 md:pt-24 bg-black/60 backdrop-blur-sm px-4">
          <div className="bg-white rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden">
            <div className="flex items-center gap-3 px-4 py-3 md:px-5 md:py-4 border-b">
              <Search size={20} className="text-gray-400 shrink-0" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Buscar productos..."
                className="flex-1 text-base outline-none bg-transparent"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button onClick={() => setSearchOpen(false)} className="text-gray-400 hover:text-black transition-colors p-1">
                <X size={20} />
              </button>
            </div>
            <div className="max-h-[60vh] md:max-h-80 overflow-y-auto">
              {searchQuery.trim() === "" ? (
                <p className="text-center text-gray-400 py-8 text-sm">Escribe para buscar productos o servicios</p>
              ) : searchResults.length === 0 ? (
                <p className="text-center text-gray-400 py-8 text-sm">No se encontraron resultados para &quot;{searchQuery}&quot;</p>
              ) : (
                searchResults.map((product) => (
                  <button
                    key={product.id}
                    onClick={() => {
                      setSearchOpen(false);
                      // TODO: redirect to product or handle click
                    }}
                    className="w-full flex items-center gap-4 px-4 py-3 hover:bg-gray-50 transition-colors text-left"
                  >
                    <img src={product.imageUrl} alt={product.name} className="w-10 h-10 md:w-12 md:h-12 object-contain mix-blend-multiply" />
                    <div>
                      <p className="font-semibold text-sm">{product.name}</p>
                      <p className="text-gray-500 text-xs line-clamp-1">{product.description}</p>
                    </div>
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
