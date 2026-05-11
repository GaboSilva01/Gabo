"use client";

import { useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { LoginModal } from "@/components/auth/LoginModal";
import { SuccessModal } from "@/components/cart/SuccessModal";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const SERVICES = [
  {
    id: "maquilar",
    name: "Maquilar",
    description: "Ofrecemos servicio de maquila personalizada para tus productos plásticos: selección de color Pantone, tipo de impresión y acabados especiales.",
    emoji: "🏭",
    tag: "SERVICIO PERSONALIZADO",
  },
];

export function OurServices() {
  const { user } = useAuthStore();
  const [showLogin, setShowLogin] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const loadLogoAsBase64 = (): Promise<string> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = '/logo.svg';
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width || 200;
        canvas.height = img.height || 60;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          resolve(canvas.toDataURL('image/png'));
        } else {
          resolve('');
        }
      };
      img.onerror = () => resolve('');
    });
  };

  const generateMaquilaQuote = async (currentUser: typeof user) => {
    if (!currentUser) return;
    setIsGenerating(true);
    try {
      const doc = new jsPDF();
      const logoBase64 = await loadLogoAsBase64();
      
      if (logoBase64) {
        doc.addImage(logoBase64, 'PNG', 14, 15, 50, 15);
      } else {
        doc.setFontSize(22);
        doc.text("Solicitud de Maquila — Coveplast", 14, 25);
      }
      
      doc.setFontSize(12);
      doc.text(`Empresa: ${currentUser.companyName}`, 14, 40);
      doc.text(`Correo: ${currentUser.email}`, 14, 46);
      doc.text(`Teléfono: ${currentUser.phone}`, 14, 52);
      doc.text(`Fecha: ${new Date().toLocaleDateString("es-VE")}`, 14, 58);

      autoTable(doc, {
        startY: 65,
        head: [["Servicio", "Descripción"]],
        body: [["Maquila personalizada", "Solicitud de cotización para servicio de maquila"]],
        theme: "grid",
        headStyles: { fillColor: [41, 128, 185] },
      });

      // Obtener el base64 limpio directamente del datauristring
      const dataUri = doc.output('datauristring');
      const pdfBase64 = dataUri.split(',')[1];

      const res = await fetch("/api/quotation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user: currentUser,
          pdfData: pdfBase64,
          subject: `Solicitud de Maquila - ${currentUser.companyName}`,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Error al enviar");
      }

      setShowSuccessModal(true);
    } catch (err) {
      console.error(err);
      alert("Hubo un error al enviar la solicitud. Intenta de nuevo.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleQuoteClick = () => {
    if (!user) {
      setShowLogin(true);
    } else {
      generateMaquilaQuote(user);
    }
  };

  return (
    <>
      <div id="servicios" className="w-full bg-white rounded-2xl shadow-sm mb-8 scroll-mt-36">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12">
          <h2 className="text-xl font-medium mb-8 text-center uppercase tracking-widest text-gray-500">
            Nuestros Servicios
          </h2>

          <div className="flex flex-col md:flex-row items-stretch justify-center gap-8 pb-8 flex-wrap">
            {SERVICES.map((service) => (
              <div
                key={service.id}
                className="flex flex-col items-center justify-between p-6 md:p-8 bg-gray-50 rounded-2xl border shadow-sm w-full md:w-96 transition-transform hover:-translate-y-1 hover:shadow-md"
              >
                <div className="w-full flex justify-between text-xs text-gray-500 mb-6 font-medium">
                  <span className="text-blue-600">{service.tag}</span>
                </div>

                <h3 className="font-bold text-2xl mb-6 text-center text-gray-900">{service.name}</h3>

                <div className="h-40 w-40 mb-6 flex items-center justify-center bg-gray-100 rounded-xl">
                  <span className="text-6xl">{service.emoji}</span>
                </div>

                <p className="text-gray-600 text-center text-sm leading-relaxed mb-6">
                  {service.description}
                </p>

                <Button
                  onClick={handleQuoteClick}
                  disabled={isGenerating}
                  className="w-full py-5 font-bold uppercase tracking-wider bg-black hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
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
              </div>
            ))}
          </div>
        </div>
      </div>

      <LoginModal
        isOpen={showLogin}
        onClose={() => setShowLogin(false)}
        onSuccess={() => {
          setShowLogin(false);
          // Pequeño delay para que el store se actualice
          setTimeout(() => {
            const freshUser = useAuthStore.getState().user;
            generateMaquilaQuote(freshUser);
          }, 100);
        }}
      />
      
      <SuccessModal 
        isOpen={showSuccessModal} 
        onClose={() => setShowSuccessModal(false)} 
      />
    </>
  );
}
