"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Product } from "@/data/mockProducts";
import { useCartStore } from "@/store/useCartStore";

interface MaquilarModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: Product | null;
  initialQuantity?: number;
}

export function MaquilaModal({ isOpen, onClose, product, initialQuantity }: MaquilarModalProps) {
  const addItem = useCartStore((state) => state.addItem);
  
  const [wantsPersonalization, setWantsPersonalization] = useState(false);
  const [colorCode, setColorCode] = useState("");
  const [needsLid, setNeedsLid] = useState(false);
  
  // Opciones específicas
  const [lidType, setLidType] = useState<'flex' | 'lisa' | ''>('');
  const [cuneteType, setCuneteType] = useState<'alimenticio' | 'industrial' | ''>('');
  const [cajetinShape, setCajetinShape] = useState<'cuadrada' | 'rectangular' | 'hexagonal' | ''>('');
  
  const [submitted, setSubmitted] = useState(false);

  // Reiniciar estado cuando el producto cambia o se abre el modal
  useEffect(() => {
    if (isOpen) {
      setWantsPersonalization(false);
      setColorCode("");
      setNeedsLid(false);
      setLidType("");
      setCuneteType("");
      setCajetinShape("");
      setSubmitted(false);
    }
  }, [isOpen, product]);

  if (!isOpen) return null;

  const isCunete = product?.name.toLowerCase().includes("cuñete");
  const isCajetin = product?.name.toLowerCase().includes("cajetin");
  const isTapa = product?.name.toLowerCase().includes("tapa");

  // Validación para habilitar el botón "Agregar"
  const isFormValid = () => {
    if (isCunete) {
      if (needsLid && !lidType) return false;
      if (!cuneteType) return false;
    }
    if (isCajetin) {
      if (!cajetinShape) return false;
    }
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!product || !isFormValid()) return;
    
    // Usamos initialQuantity si existe, sino el minOrder
    const quantityToAdd = initialQuantity || product.minOrder;
    
    addItem(product, quantityToAdd, {
      wantsPersonalization,
      pantoneColor: wantsPersonalization ? colorCode : "",
      needsLid,
      ...(lidType && { lidType: lidType as 'flex' | 'lisa' }),
      ...(cuneteType && { cuneteType: cuneteType as 'alimenticio' | 'industrial' }),
      ...(cajetinShape && { cajetinShape: cajetinShape as 'cuadrada' | 'rectangular' | 'hexagonal' }),
    });
    
    setSubmitted(true);
    setTimeout(() => {
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl animate-in fade-in zoom-in duration-200 overflow-hidden max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-5 border-b">
          <div>
            <h2 className="text-xl font-bold">Personalizar producto</h2>
            {product && <p className="text-sm text-gray-500 mt-0.5">{product.name}</p>}
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-black transition-colors">
            <X size={22} />
          </button>
        </div>

        <div className="overflow-y-auto">
          {submitted ? (
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">✓</div>
              <h3 className="text-xl font-bold mb-2">¡Agregado al carrito!</h3>
              <p className="text-gray-500 mb-6">El producto con tus preferencias ha sido agregado.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-6">
              
              {/* Opciones específicas para Cajetines */}
              {isCajetin && (
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <label className="block text-sm font-bold text-gray-800 mb-3">
                    Forma del Cajetín (Requerido)
                  </label>
                  <div className="flex flex-col gap-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="radio" 
                        name="cajetinShape"
                        value="cuadrada"
                        checked={cajetinShape === 'cuadrada'}
                        onChange={(e) => setCajetinShape('cuadrada')}
                        className="text-black focus:ring-black accent-black"
                      />
                      <span>Cuadrado</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="radio" 
                        name="cajetinShape"
                        value="rectangular"
                        checked={cajetinShape === 'rectangular'}
                        onChange={(e) => setCajetinShape('rectangular')}
                        className="text-black focus:ring-black accent-black"
                      />
                      <span>Rectangular</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="radio" 
                        name="cajetinShape"
                        value="hexagonal"
                        checked={cajetinShape === 'hexagonal'}
                        onChange={(e) => setCajetinShape('hexagonal')}
                        className="text-black focus:ring-black accent-black"
                      />
                      <span>Hexagonal</span>
                    </label>
                  </div>
                </div>
              )}

              {/* Opciones específicas para Cuñetes */}
              {isCunete && (
                <>
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                    <label className="block text-sm font-bold text-gray-800 mb-3">
                      Tipo de Cuñete (Requerido)
                    </label>
                    <div className="flex flex-col gap-2">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input 
                          type="radio" 
                          name="cuneteType"
                          value="alimenticio"
                          checked={cuneteType === 'alimenticio'}
                          onChange={(e) => setCuneteType('alimenticio')}
                          className="text-black focus:ring-black accent-black"
                        />
                        <span>Alimenticio</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input 
                          type="radio" 
                          name="cuneteType"
                          value="industrial"
                          checked={cuneteType === 'industrial'}
                          onChange={(e) => setCuneteType('industrial')}
                          className="text-black focus:ring-black accent-black"
                        />
                        <span>Industrial</span>
                      </label>
                    </div>
                  </div>
                </>
              )}

              {/* Casilla de Tapa - solo si NO es Cajetines y NO es Tapas */}
              {!isCajetin && !isTapa && (
                <div className="flex flex-col gap-3">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="w-5 h-5 rounded border-gray-300 text-black focus:ring-black accent-black"
                      checked={needsLid}
                      onChange={(e) => {
                        setNeedsLid(e.target.checked);
                        if (!e.target.checked) setLidType("");
                      }}
                    />
                    <span className="font-semibold text-gray-800">Necesita Tapa</span>
                  </label>

                  {/* Opciones de tapa para Cuñete */}
                  {isCunete && needsLid && (
                    <div className="pl-8 flex flex-col gap-2 animate-in fade-in duration-200">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input 
                          type="radio" 
                          name="lidType"
                          value="flex"
                          checked={lidType === 'flex'}
                          onChange={(e) => setLidType('flex')}
                          className="text-black focus:ring-black accent-black"
                        />
                        <span className="text-sm">Tapa Flex</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input 
                          type="radio" 
                          name="lidType"
                          value="lisa"
                          checked={lidType === 'lisa'}
                          onChange={(e) => setLidType('lisa')}
                          className="text-black focus:ring-black accent-black"
                        />
                        <span className="text-sm">Tapa Lisa</span>
                      </label>
                    </div>
                  )}
                </div>
              )}

              {/* Personalización de impresión: solo disponible para productos que no sean Cajetines */}
              {!isCajetin && (
                <>
                  <hr className="border-gray-100" />

                  {/* Casilla de Personalización */}
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="w-5 h-5 rounded border-gray-300 text-black focus:ring-black accent-black"
                      checked={wantsPersonalization}
                      onChange={(e) => setWantsPersonalization(e.target.checked)}
                    />
                    <span className="font-semibold text-gray-800">Desea Personalización (Impresión)</span>
                  </label>

                  {/* Color Pantone (solo si seleccionó personalización) */}
                  {wantsPersonalization && (
                    <div className="pl-8 animate-in fade-in slide-in-from-top-2 duration-200">
                      <label className="block text-sm font-semibold text-gray-800 mb-1">
                        Color <span className="text-gray-400 font-normal">(código Pantone)</span>
                      </label>
                      <input
                        type="text"
                        value={colorCode}
                        onChange={(e) => setColorCode(e.target.value)}
                        placeholder="Ej: Pantone 032 C..."
                        className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                      />
                    </div>
                  )}
                </>
              )}

              <Button
                type="submit"
                disabled={!isFormValid()}
                className="w-full py-6 text-base font-bold bg-black hover:bg-gray-800 mt-2 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Agregar al Carrito ({initialQuantity?.toLocaleString() || product?.minOrder.toLocaleString()} unid.)
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
