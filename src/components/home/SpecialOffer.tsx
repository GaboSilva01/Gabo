"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { mockProducts, Product } from "@/data/mockProducts";
import { useCartStore } from "@/store/useCartStore";
import { MaquilarModal } from "@/components/services/MaquilarModal";
import { Minus, Plus } from "lucide-react";

export function SpecialOffer() {
  const addItem = useCartStore((state) => state.addItem);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [animatingProductId, setAnimatingProductId] = useState<string | null>(null);
  
  // Estado para las cantidades seleccionadas por producto
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  const getQuantity = (productId: string, minOrder: number) => {
    return quantities[productId] || minOrder;
  };

  const handleUpdateQuantity = (productId: string, newQuantity: number, minOrder: number) => {
    setQuantities(prev => ({
      ...prev,
      [productId]: Math.max(newQuantity, minOrder)
    }));
  };

  return (
    <>
      <div id="productos" className="w-full bg-white rounded-b-2xl shadow-sm mb-8 scroll-mt-36">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12">
          <h2 className="text-xl font-medium mb-8 text-center uppercase tracking-widest text-gray-500">
            Nuestros Productos
          </h2>

          <div className="flex flex-col md:flex-row items-stretch justify-center gap-8 pb-8 flex-wrap">
            {mockProducts.map((product) => {
              const isCustomizable = product.customizable !== false;
              const currentQuantity = getQuantity(product.id, product.minOrder);
              
              return (
                <div
                  key={product.id}
                  className="flex flex-col items-center justify-between p-6 md:p-8 bg-gray-50 rounded-2xl border shadow-sm w-full md:w-80 transition-transform hover:-translate-y-1 hover:shadow-md"
                >
                  <div className="w-full flex justify-center text-xs text-gray-500 mb-6 font-medium">
                    <span>PEDIDO MÍN: {product.minOrder.toLocaleString()}</span>
                  </div>

                  <h3 className="font-bold text-2xl mb-6 text-center text-gray-900">
                    {product.name}
                  </h3>

                  {/* Imagen clickeable solo si es personalizable */}
                  {isCustomizable ? (
                    <button
                      onClick={() => setSelectedProduct({ ...product, selectedQuantity: currentQuantity } as any)}
                      className="relative h-56 w-56 mb-6 group focus:outline-none"
                      title="Personalizar este producto"
                    >
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="object-contain w-full h-full mix-blend-multiply drop-shadow-xl transition-transform group-hover:scale-105"
                      />
                      <span className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="bg-black/70 text-white text-xs font-bold px-3 py-1 rounded-full">Personalizar</span>
                      </span>
                    </button>
                  ) : (
                    <div className="relative h-56 w-56 mb-6">
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="object-contain w-full h-full mix-blend-multiply drop-shadow-xl"
                      />
                    </div>
                  )}

                  <p className="text-gray-600 text-center mb-6 min-h-[48px] text-sm">
                    {product.description}
                  </p>

                  <div className="w-full mb-6">
                    <label className="block text-xs font-bold text-gray-500 mb-2 text-center uppercase tracking-wide">
                      Cantidad a solicitar
                    </label>
                    <div className="flex items-center justify-between border border-gray-300 rounded-lg overflow-hidden bg-white">
                      <button 
                        onClick={() => handleUpdateQuantity(product.id, currentQuantity - 100, product.minOrder)}
                        className="p-3 text-gray-500 hover:text-black hover:bg-gray-100 transition-colors"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="font-semibold text-lg">{currentQuantity.toLocaleString()}</span>
                      <button 
                        onClick={() => handleUpdateQuantity(product.id, currentQuantity + 100, product.minOrder)}
                        className="p-3 text-gray-500 hover:text-black hover:bg-gray-100 transition-colors"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>

                  <div className="mt-auto w-full flex flex-col gap-2">
                    {isCustomizable ? (
                      <Button
                        onClick={() => setSelectedProduct({ ...product, selectedQuantity: currentQuantity } as any)}
                        className="w-full py-5 font-bold uppercase tracking-wider bg-black hover:bg-gray-800 text-white transition-all duration-300"
                      >
                        Personalizar
                      </Button>
                    ) : (
                      <Button
                        onClick={() => {
                          addItem(product, currentQuantity);
                          setAnimatingProductId(product.id);
                          setTimeout(() => setAnimatingProductId(null), 1000);
                        }}
                        className={`w-full py-5 font-bold uppercase tracking-wider transition-all duration-300 ${
                          animatingProductId === product.id
                            ? "bg-green-600 text-white scale-95"
                            : "bg-black hover:bg-gray-800 text-white"
                        }`}
                      >
                        {animatingProductId === product.id ? "¡Agregado!" : "Agregar al Carrito"}
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <MaquilarModal
        isOpen={selectedProduct !== null}
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        initialQuantity={(selectedProduct as any)?.selectedQuantity}
      />
    </>
  );
}
