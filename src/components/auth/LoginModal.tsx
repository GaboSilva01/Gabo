"use client";

import { useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

// Prefijos de operadoras venezolanas
const VE_PREFIXES = [
  { prefix: "0412", operator: "Digitel" },
  { prefix: "0414", operator: "Movistar" },
  { prefix: "0416", operator: "Movistar" },
  { prefix: "0422", operator: "Digitel" },
  { prefix: "0424", operator: "Movilnet" },
  { prefix: "0426", operator: "Movilnet" },
];

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function LoginModal({ isOpen, onClose, onSuccess }: LoginModalProps) {
  const { user, setUser } = useAuthStore();

  const [selectedPrefix, setSelectedPrefix] = useState(
    user?.phone?.match(/^0\d{3}/)?.[0] || "0412"
  );
  const [phoneNumber, setPhoneNumber] = useState(
    user?.phone?.replace(/^0\d{3}/, "") || ""
  );
  const [formData, setFormData] = useState({
    email: user?.email ?? "",
    companyName: user?.companyName ?? "",
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const fullPhone = `+58 ${selectedPrefix.replace("0", "")}${phoneNumber}`;
    setUser({ ...formData, phone: fullPhone });
    onSuccess();
  };

  const isPreFilled = !!user;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-md p-6 relative shadow-2xl animate-in fade-in zoom-in duration-200">
        <button onClick={onClose} className="absolute right-4 top-4 text-gray-400 hover:text-black transition-colors">
          <X size={20} />
        </button>

        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold mb-2">
            {isPreFilled ? "Confirma tus datos" : "Ingresa tus datos"}
          </h2>
          <p className="text-gray-500 text-sm">
            {isPreFilled
              ? "Tus datos están guardados. Puedes editarlos si es necesario."
              : "Para generar tu cotización necesitamos un poco de información."}
          </p>
        </div>

        {isPreFilled && (
          <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-2 mb-4 text-sm text-green-700">
            ✓ Datos guardados automáticamente para futuras cotizaciones
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre de la Empresa</label>
            <input
              type="text"
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
              value={formData.companyName}
              onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
              placeholder="Ej. Mi Empresa S.A."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Correo Electrónico</label>
            <input
              type="email"
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="ejemplo@correo.com"
            />
          </div>

          {/* Teléfono venezolano con prefijo de operadora */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Número Telefónico</label>
            <div className="flex gap-2">
              {/* Selector de prefijo */}
              <select
                value={selectedPrefix}
                onChange={(e) => setSelectedPrefix(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-black outline-none bg-white shrink-0 w-[140px]"
              >
                {VE_PREFIXES.map(({ prefix, operator }) => (
                  <option key={prefix} value={prefix}>
                    {prefix} · {operator}
                  </option>
                ))}
              </select>
              {/* Resto del número (7 dígitos) */}
              <input
                type="tel"
                required
                maxLength={7}
                pattern="\d{7}"
                className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, "").slice(0, 7))}
                placeholder="1234567 (7 dígitos)"
              />
            </div>
            <p className="text-xs text-gray-400 mt-1">
              Se guardará como: +58 {selectedPrefix.replace("0", "")}{phoneNumber || "XXXXXXX"}
            </p>
          </div>

          <Button type="submit" className="w-full py-6 mt-4 text-lg font-bold bg-black hover:bg-gray-800">
            {isPreFilled ? "Generar Cotización" : "Continuar"}
          </Button>
        </form>
      </div>
    </div>
  );
}
