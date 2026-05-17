"use client";

import { useState, useEffect } from "react";
import { X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/useAuthStore";
import { SuccessModal } from "@/components/cart/SuccessModal";
import { LoginModal } from "@/components/auth/LoginModal";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// Tipos de material plástico aceptados en el servicio de molienda
const MATERIAL_TYPES = [
  { value: "pp", label: "PP – Polipropileno" },
  { value: "pe", label: "PE – Polietileno" },
  { value: "pead", label: "PEAD – Polietileno de Alta Densidad" },
  { value: "pebd", label: "PEBD – Polietileno de Baja Densidad" },
  { value: "abs", label: "ABS – Acrilonitrilo Butadieno Estireno" },
  { value: "otro", label: "Otro / No sé" },
];

interface MoliendaModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MoliendaModal({ isOpen, onClose }: MoliendaModalProps) {
  const { user } = useAuthStore();

  // Estado del formulario
  const [materialType, setMaterialType] = useState("");
  const [quantity, setQuantity] = useState("");
  const [observations, setObservations] = useState("");

  // Estado del flujo de auth + generación
  const [showLogin, setShowLogin] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Reiniciar formulario al abrir/cerrar el modal
  useEffect(() => {
    if (isOpen) {
      setMaterialType("");
      setQuantity("");
      setObservations("");
    }
  }, [isOpen]);

  const isFormValid = materialType !== "" && quantity.trim() !== "";

  const loadLogoAsBase64 = (): Promise<string> =>
    new Promise((resolve) => {
      const img = new Image();
      img.src = "/logo.svg";
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const MAX_WIDTH = 400;
        const scale =
          img.width && img.width > MAX_WIDTH ? MAX_WIDTH / img.width : 1;
        canvas.width = (img.width * scale) || 200;
        canvas.height = (img.height * scale) || 60;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          resolve(canvas.toDataURL("image/png"));
        } else {
          resolve("");
        }
      };
      img.onerror = () => resolve("");
    });

  const generateAndSendQuote = async (currentUser: typeof user) => {
    if (!currentUser || !isFormValid) return;
    setIsGenerating(true);

    try {
      const doc = new jsPDF();
      const logoBase64 = await loadLogoAsBase64();

      if (logoBase64) {
        doc.addImage(logoBase64, "PNG", 14, 15, 50, 15);
      } else {
        doc.setFontSize(22);
        doc.text("Solicitud de Molienda — Coveplast", 14, 25);
      }

      doc.setFontSize(12);
      doc.text(`Empresa: ${currentUser.companyName}`, 14, 40);
      doc.text(`Correo: ${currentUser.email}`, 14, 46);
      doc.text(`Teléfono: ${currentUser.phone}`, 14, 52);
      doc.text(`Fecha: ${new Date().toLocaleDateString("es-VE")}`, 14, 58);

      const selectedMaterial =
        MATERIAL_TYPES.find((m) => m.value === materialType)?.label ?? materialType;

      autoTable(doc, {
        startY: 65,
        head: [["Detalle", "Valor"]],
        body: [
          ["Servicio", "Molienda de material plástico"],
          ["Tipo de material", selectedMaterial],
          ["Cantidad estimada", `${quantity} kg`],
          ["Observaciones", observations.trim() || "—"],
        ],
        theme: "grid",
        headStyles: { fillColor: [41, 128, 185] },
        columnStyles: { 0: { fontStyle: "bold", cellWidth: 60 } },
      });

      const dataUri = doc.output("datauristring");
      const pdfBase64 = dataUri.split(",")[1];

      const res = await fetch("/api/quotation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user: currentUser,
          pdfData: pdfBase64,
          subject: `Solicitud de Molienda - ${currentUser.companyName}`,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? "Error al enviar");
      }

      setShowSuccess(true);
      onClose();
    } catch (err) {
      console.error(err);
      alert("Hubo un error al enviar la solicitud. Intenta de nuevo.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    if (!user) {
      setShowLogin(true);
    } else {
      generateAndSendQuote(user);
    }
  };

  if (!isOpen && !showSuccess) return null;

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl animate-in fade-in zoom-in duration-200 overflow-hidden max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b">
              <div>
                <h2 className="text-xl font-bold">Solicitar Molienda</h2>
                <p className="text-sm text-gray-500 mt-0.5">
                  Completa los datos para recibir tu cotización
                </p>
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
              <form
                onSubmit={handleSubmit}
                className="p-6 flex flex-col gap-6"
              >
                {/* Tipo de material */}
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <label className="block text-sm font-bold text-gray-800 mb-3">
                    Tipo de material plástico{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <div className="flex flex-col gap-2">
                    {MATERIAL_TYPES.map((mat) => (
                      <label
                        key={mat.value}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <input
                          type="radio"
                          name="materialType"
                          value={mat.value}
                          checked={materialType === mat.value}
                          onChange={() => setMaterialType(mat.value)}
                          className="accent-black"
                        />
                        <span className="text-sm">{mat.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Cantidad estimada */}
                <div>
                  <label className="block text-sm font-bold text-gray-800 mb-1">
                    Cantidad estimada (kg){" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    placeholder="Ej: 500"
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                  />
                </div>

                {/* Observaciones */}
                <div>
                  <label className="block text-sm font-bold text-gray-800 mb-1">
                    Observaciones{" "}
                    <span className="text-gray-400 font-normal">
                      (opcional)
                    </span>
                  </label>
                  <textarea
                    value={observations}
                    onChange={(e) => setObservations(e.target.value)}
                    rows={3}
                    placeholder="Describe el estado del material, urgencia u otras consideraciones..."
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all resize-none"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={!isFormValid || isGenerating}
                  className="w-full py-6 text-base font-bold bg-black hover:bg-gray-800 mt-2 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="animate-spin" size={18} />
                      Enviando...
                    </>
                  ) : (
                    "Solicitar cotización"
                  )}
                </Button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Login: se activa cuando el usuario no está autenticado */}
      <LoginModal
        isOpen={showLogin}
        onClose={() => setShowLogin(false)}
        onSuccess={() => {
          setShowLogin(false);
          setTimeout(() => {
            const freshUser = useAuthStore.getState().user;
            generateAndSendQuote(freshUser);
          }, 100);
        }}
      />

      {/* Modal de éxito: se muestra tras el envío exitoso */}
      <SuccessModal
        isOpen={showSuccess}
        onClose={() => setShowSuccess(false)}
      />
    </>
  );
}
