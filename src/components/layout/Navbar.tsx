"use client";
import Link from "next/link";
import Image from "next/image";
import { useCartStore } from "@/store/useCartStore";
import { useEffect, useRef, useState } from "react";
import { Search, X } from "lucide-react";
import { mockProducts } from "@/data/mockProducts";

export function Navbar() {
  const { items, openCart } = useCartStore();
  const cartItemCount = items.reduce((acc, item) => acc + item.quantity, 0);

  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);
  const [showLogo, setShowLogo] = useState(true);
  const [searchOpen, setSearchOpen] = useState(false);
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
        className="w-full bg-white border-b border-gray-200 px-8 sticky top-0 z-50 transition-transform duration-300"
        style={{
          minHeight: "140px",
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

        <div className="relative h-full max-w-7xl mx-auto flex items-center justify-between" style={{ minHeight: "140px" }}>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium tracking-wide">
            <Link href="/" className="text-black hover:text-gray-600 transition-colors">INICIO</Link>
            
            <div className="relative group py-4 cursor-pointer">
              <Link href="/catalogo" className="text-gray-500 group-hover:text-black transition-colors flex items-center gap-1">
                CATÁLOGO <span className="text-xs transition-transform duration-200 group-hover:rotate-180">▼</span>
              </Link>
              
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-0 bg-white shadow-xl rounded-xl border border-gray-100 py-3 w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 translate-y-2 group-hover:translate-y-0">
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

          <Link
            href="/"
            className={`absolute left-1/2 -translate-x-1/2 flex items-center transition-all duration-300 ${showLogo ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 pointer-events-none"
              }`}
          >
            <Image src="/logo.svg" alt="Coveplast Logo" width={280} height={100} className="object-contain" priority unoptimized />
          </Link>

          <div className="flex items-center gap-6 text-sm font-medium tracking-wide ml-auto md:ml-0">
            <button
              onClick={() => setSearchOpen(true)}
              className="hidden md:flex items-center gap-2 text-gray-500 hover:text-black transition-colors"
              aria-label="Abrir buscador"
            >
              <Search size={16} />
              BUSCAR
            </button>
            {/* Contáctanos */}
            <a
              href="mailto:coveplast.comercializacion@gmail.com"
              className="hidden md:flex items-center gap-1 text-gray-500 hover:text-black transition-colors"
              title="coveplast.comercializacion@gmail.com"
            >
              CONTÁCTANOS
            </a>
            <button
              onClick={openCart}
              className="flex items-center gap-2 text-black hover:text-gray-600 transition-colors bg-gray-100 px-4 py-2 rounded-full"
            >
              CARRITO ({cartItemCount})
            </button>
          </div>
        </div>
      </header>

      {/* Modal de búsqueda */}
      {searchOpen && (
        <div className="fixed inset-0 z-[200] flex flex-col items-center pt-24 bg-black/60 backdrop-blur-sm px-4">
          <div className="bg-white rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden">
            <div className="flex items-center gap-3 px-5 py-4 border-b">
              <Search size={20} className="text-gray-400 shrink-0" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Buscar productos o servicios..."
                className="flex-1 text-base outline-none bg-transparent"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button onClick={() => setSearchOpen(false)} className="text-gray-400 hover:text-black transition-colors">
                <X size={20} />
              </button>
            </div>
            <div className="max-h-80 overflow-y-auto">
              {searchQuery.trim() === "" ? (
                <p className="text-center text-gray-400 py-8 text-sm">Escribe para buscar productos o servicios</p>
              ) : searchResults.length === 0 ? (
                <p className="text-center text-gray-400 py-8 text-sm">No se encontraron resultados para &quot;{searchQuery}&quot;</p>
              ) : (
                searchResults.map((product) => (
                  <button
                    key={product.id}
                    onClick={() => setSearchOpen(false)}
                    className="w-full flex items-center gap-4 px-5 py-3 hover:bg-gray-50 transition-colors text-left"
                  >
                    <img src={product.imageUrl} alt={product.name} className="w-12 h-12 object-contain mix-blend-multiply" />
                    <div>
                      <p className="font-semibold text-sm">{product.name}</p>
                      <p className="text-gray-500 text-xs">{product.description}</p>
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
