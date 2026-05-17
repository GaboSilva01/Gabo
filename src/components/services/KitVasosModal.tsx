"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Product } from "@/data/mockProducts";
import { useCartStore } from "@/store/useCartStore";

// ─────────────────────────────────────────────
// COLORES DISPONIBLES DEL KIT — Catálogo oficial
// Fuente: lista VASO INCOR 550ML TIPO A
// ─────────────────────────────────────────────
const KIT_COLORS: { value: string; label: string; hex: string }[] = [
  { value: "amarillo",          label: "Amarillo",          hex: "#FFD600" },
  { value: "amarillo-claro",    label: "Amarillo Claro",    hex: "#FFE97A" },
  { value: "amarillo-limon",    label: "Amarillo Limón",    hex: "#D4E600" },
  { value: "fucsia",            label: "Fucsia",            hex: "#E8008A" },
  { value: "verde-turqueza",    label: "Verde Turqueza",    hex: "#00BFA5" },
  { value: "verde-manzana",     label: "Verde Manzana",     hex: "#7BC900" },
  { value: "verde-grama",       label: "Verde Grama",       hex: "#3A8A2E" },
  { value: "rojo",              label: "Rojo",              hex: "#E52222" },
  { value: "azul",              label: "Azul",              hex: "#29ABE2" },
  { value: "azul-bebe",         label: "Azul Bebé",         hex: "#A8D8F0" },
  { value: "azul-rey-oscuro",   label: "Azul Rey Oscuro",   hex: "#1A3A8A" },
];

interface KitVasosModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: Product | null;
  initialQuantity?: number;
}

export function KitVasosModal({
  isOpen,
  onClose,
  product,
  initialQuantity,
}: KitVasosModalProps) {
  const addItem = useCartStore((state) => state.addItem);

  // Colores seleccionados (puede ser más de uno)
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);

  // Reiniciar al abrir el modal
  useEffect(() => {
    if (isOpen) {
      setSelectedColors([]);
      setSubmitted(false);
    }
  }, [isOpen, product]);

  if (!isOpen) return null;

  const toggleColor = (colorValue: string) => {
    setSelectedColors((prev) =>
      prev.includes(colorValue)
        ? prev.filter((c) => c !== colorValue)
        : [...prev, colorValue]
    );
  };

  const isFormValid = selectedColors.length > 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!product || !isFormValid) return;

    const quantityToAdd = initialQuantity ?? product.minOrder;
    const colorsLabel = selectedColors
      .map((v) => KIT_COLORS.find((c) => c.value === v)?.label ?? v)
      .join(", ");

    addItem(product, quantityToAdd, {
      // Reutilizamos el campo pantoneColor para transportar los colores
      // elegidos hasta el PDF/carrito, sin necesidad de extender el tipo CustomOptions.
      wantsPersonalization: true,
      pantoneColor: colorsLabel,
    });

    setSubmitted(true);
    setTimeout(() => {
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl animate-in fade-in zoom-in duration-200 overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b">
          <div>
            <h2 className="text-xl font-bold">Personalizar Kit</h2>
            {product && (
              <p className="text-sm text-gray-500 mt-0.5">{product.name}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-black transition-colors"
          >
            <X size={22} />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto">
          {submitted ? (
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
                ✓
              </div>
              <h3 className="text-xl font-bold mb-2">¡Agregado al carrito!</h3>
              <p className="text-gray-500">
                El kit con tu selección de colores ha sido agregado.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-6">
              {/* Sección de colores */}
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                <label className="block text-sm font-bold text-gray-800 mb-1">
                  Color del Kit{" "}
                  <span className="text-red-500">*</span>
                </label>
                <p className="text-xs text-gray-400 mb-4">
                  Puedes seleccionar uno o más colores.
                </p>

                <div className="grid grid-cols-2 gap-3">
                  {KIT_COLORS.map((color) => {
                    const isSelected = selectedColors.includes(color.value);
                    return (
                      <label
                        key={color.value}
                        className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all duration-150 select-none ${
                          isSelected
                            ? "border-black bg-black/5"
                            : "border-gray-200 hover:border-gray-400 bg-white"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleColor(color.value)}
                          className="sr-only"
                        />
                        {/* Muestra de color */}
                        <span
                          className="w-6 h-6 rounded-full border border-gray-300 flex-shrink-0 shadow-sm"
                          style={{ backgroundColor: color.hex }}
                        />
                        <span className="text-sm font-medium text-gray-800">
                          {color.label}
                        </span>
                        {/* Checkmark visual */}
                        {isSelected && (
                          <span className="ml-auto text-black font-bold text-base leading-none">
                            ✓
                          </span>
                        )}
                      </label>
                    );
                  })}
                </div>

                {selectedColors.length > 0 && (
                  <p className="text-xs text-gray-500 mt-3">
                    Seleccionados:{" "}
                    <span className="font-semibold text-gray-800">
                      {selectedColors
                        .map(
                          (v) =>
                            KIT_COLORS.find((c) => c.value === v)?.label ?? v
                        )
                        .join(", ")}
                    </span>
                  </p>
                )}
              </div>

              <Button
                type="submit"
                disabled={!isFormValid}
                className="w-full py-6 text-base font-bold bg-black hover:bg-gray-800 mt-2 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Agregar al Carrito (
                {(initialQuantity ?? product?.minOrder ?? 0).toLocaleString()}{" "}
                unid.)
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
