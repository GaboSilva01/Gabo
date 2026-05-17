"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { mockProducts, Product } from "@/data/mockProducts";
import { useCartStore } from "@/store/useCartStore";
import { MaquilaModal } from "@/components/services/MaquilarModal";
import { KitVasosModal } from "@/components/services/KitVasosModal";
import { Minus, Plus, Sparkles, ShoppingCart, CheckCircle2 } from "lucide-react";

export function SpecialOffer() {
  const addItem = useCartStore((state) => state.addItem);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [kitProduct, setKitProduct] = useState<Product | null>(null);
  const [animatingProductId, setAnimatingProductId] = useState<string | null>(null);
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  const getQuantity = (productId: string, minOrder: number) =>
    quantities[productId] || minOrder;

  const handleUpdateQuantity = (
    productId: string,
    newQuantity: number,
    minOrder: number
  ) => {
    setQuantities((prev) => ({
      ...prev,
      [productId]: Math.max(newQuantity, minOrder),
    }));
  };

  const handlePersonalizeClick = (product: Product, quantity: number) => {
    if (product.kitVasos) {
      setKitProduct({ ...product, selectedQuantity: quantity } as any);
    } else {
      setSelectedProduct({ ...product, selectedQuantity: quantity } as any);
    }
  };

  return (
    <>
      <section id="productos" className="w-full scroll-mt-24 mb-10">
        {/* Header de sección */}
        <div className="max-w-7xl mx-auto px-4 md:px-8 pt-10 pb-8">
          <div className="flex flex-col items-center text-center mb-10">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold tracking-widest uppercase px-3 py-1.5 rounded-full mb-4"
              style={{ background: "var(--accent-light)", color: "var(--accent)" }}>
              🛍️ Catálogo
            </span>
            <h2 className="text-3xl md:text-4xl font-black tracking-tight"
              style={{ color: "var(--primary)" }}>
              Nuestros Productos
            </h2>
            <p className="text-slate-500 mt-2 max-w-lg text-sm">
              Selecciona la cantidad, personaliza y agrega a tu cotización.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {mockProducts.map((product) => {
              const isCustomizable = product.customizable !== false;
              const currentQuantity = getQuantity(product.id, product.minOrder);
              const isAnimating = animatingProductId === product.id;

              return (
                <div
                  key={product.id}
                  className="group relative flex flex-col bg-white rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1"
                  style={{
                    border: "1px solid var(--border)",
                    boxShadow: "0 2px 8px rgba(10,35,66,0.05)",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLDivElement).style.boxShadow =
                      "0 12px 40px rgba(10,35,66,0.12)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLDivElement).style.boxShadow =
                      "0 2px 8px rgba(10,35,66,0.05)";
                  }}
                >
                  {/* Badge pedido mínimo */}
                  <div className="absolute top-3 left-3 z-10">
                    <span className="text-[10px] font-bold px-2 py-1 rounded-full"
                      style={{ background: "var(--accent-light)", color: "var(--accent)" }}>
                      MÍN. {product.minOrder.toLocaleString()} unid.
                    </span>
                  </div>

                  {/* Área de imagen */}
                  <div
                    className="relative flex items-center justify-center pt-10 pb-4 px-6 cursor-pointer"
                    style={{ background: "linear-gradient(135deg, #F8FAFF 0%, #EFF4FF 100%)", minHeight: "200px" }}
                    onClick={() =>
                      isCustomizable && handlePersonalizeClick(product, currentQuantity)
                    }
                  >
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="object-contain w-full h-40 mix-blend-multiply drop-shadow-lg transition-transform duration-300 group-hover:scale-105"
                    />

                    {/* Overlay personalizar */}
                    {isCustomizable && (
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                        style={{ background: "rgba(10,35,66,0.55)" }}>
                        <span className="flex items-center gap-2 text-white text-xs font-bold px-4 py-2 rounded-full"
                          style={{ background: "rgba(0,119,255,0.9)" }}>
                          <Sparkles size={12} />
                          Personalizar
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex flex-col flex-1 px-4 pb-5 pt-3 gap-3">
                    <div>
                      <h3 className="font-bold text-base leading-tight"
                        style={{ color: "var(--foreground)" }}>
                        {product.name}
                      </h3>
                      <p className="text-xs mt-1 line-clamp-2"
                        style={{ color: "var(--muted-foreground)" }}>
                        {product.description}
                      </p>
                    </div>

                    {/* Selector de cantidad */}
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider"
                        style={{ color: "var(--muted-foreground)" }}>
                        Cantidad
                      </span>
                      <div className="flex items-center mt-1.5 rounded-lg overflow-hidden"
                        style={{ border: "1px solid var(--border)" }}>
                        <button
                          onClick={() =>
                            handleUpdateQuantity(product.id, currentQuantity - 100, product.minOrder)
                          }
                          className="flex-none px-3 py-2 text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-colors"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="flex-1 text-center font-bold text-sm"
                          style={{ color: "var(--foreground)" }}>
                          {currentQuantity.toLocaleString()}
                        </span>
                        <button
                          onClick={() =>
                            handleUpdateQuantity(product.id, currentQuantity + 100, product.minOrder)
                          }
                          className="flex-none px-3 py-2 text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-colors"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>

                    {/* Botón de acción */}
                    <div className="mt-auto">
                      {isCustomizable ? (
                        <button
                          onClick={() => handlePersonalizeClick(product, currentQuantity)}
                          className="w-full py-2.5 rounded-xl text-sm font-bold transition-all duration-200 flex items-center justify-center gap-2"
                          style={{
                            background: "var(--primary)",
                            color: "white",
                          }}
                          onMouseEnter={(e) => {
                            (e.currentTarget as HTMLButtonElement).style.background = "var(--primary-hover)";
                          }}
                          onMouseLeave={(e) => {
                            (e.currentTarget as HTMLButtonElement).style.background = "var(--primary)";
                          }}
                        >
                          <Sparkles size={14} />
                          Personalizar
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            addItem(product, currentQuantity);
                            setAnimatingProductId(product.id);
                            setTimeout(() => setAnimatingProductId(null), 1500);
                          }}
                          className="w-full py-2.5 rounded-xl text-sm font-bold transition-all duration-300 flex items-center justify-center gap-2"
                          style={{
                            background: isAnimating ? "#16A34A" : "var(--primary)",
                            color: "white",
                            transform: isAnimating ? "scale(0.97)" : "scale(1)",
                          }}
                        >
                          {isAnimating ? (
                            <>
                              <CheckCircle2 size={14} />
                              ¡Agregado!
                            </>
                          ) : (
                            <>
                              <ShoppingCart size={14} />
                              Agregar al Carrito
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <MaquilaModal
        isOpen={selectedProduct !== null}
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        initialQuantity={(selectedProduct as any)?.selectedQuantity}
      />

      <KitVasosModal
        isOpen={kitProduct !== null}
        product={kitProduct}
        onClose={() => setKitProduct(null)}
        initialQuantity={(kitProduct as any)?.selectedQuantity}
      />
    </>
  );
}
