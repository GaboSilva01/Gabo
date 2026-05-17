"use client";

import { useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { LoginModal } from "@/components/auth/LoginModal";
import { SuccessModal } from "@/components/cart/SuccessModal";
import { MoliendaModal } from "@/components/services/MoliendaModal";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const SERVICES = [
  {
    id: "maquilar",
    name: "Maquila",
    description: "Ofrecemos servicio de maquila personalizada para tus productos plásticos: selección de color Pantone, tipo de impresión y acabados especiales.",
    emoji: "🏭",
    tag: "SERVICIO PERSONALIZADO",
  },
  {
    id: "molienda",
    name: "Molienda",
    description: "Servicio de molienda de materiales plásticos para reciclaje y reutilización industrial. Procesamos tus residuos con eficiencia y calidad.",
    emoji: "⚙️",
    tag: "SERVICIO INDUSTRIAL",
  },
];

export function OurServices() {
  const { user } = useAuthStore();
  const [showLogin, setShowLogin] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showMoliendaModal, setShowMoliendaModal] = useState(false);

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

  const generateServiceQuote = async (currentUser: typeof user, serviceId: string, serviceName: string) => {
    if (!currentUser) return;
    setIsGenerating(true);
    try {
      const doc = new jsPDF();
      const logoBase64 = await loadLogoAsBase64();
      
      if (logoBase64) {
        doc.addImage(logoBase64, 'PNG', 14, 15, 50, 15);
      } else {
        doc.setFontSize(22);
        doc.text(`Solicitud de ${serviceName} — Coveplast`, 14, 25);
      }
      
      doc.setFontSize(12);
      doc.text(`Empresa: ${currentUser.companyName}`, 14, 40);
      doc.text(`Correo: ${currentUser.email}`, 14, 46);
      doc.text(`Teléfono: ${currentUser.phone}`, 14, 52);
      doc.text(`Fecha: ${new Date().toLocaleDateString("es-VE")}`, 14, 58);

      autoTable(doc, {
        startY: 65,
        head: [["Servicio", "Descripción"]],
        body: [[serviceName, `Solicitud de cotización para servicio de ${serviceName.toLowerCase()}`]],
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
          subject: `Solicitud de ${serviceName} - ${currentUser.companyName}`,
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

  const [pendingService, setPendingService] = useState<{ id: string; name: string } | null>(null);

  const handleQuoteClick = (serviceId: string, serviceName: string) => {
    // El servicio de Molienda tiene su propio modal con formulario específico
    if (serviceId === "molienda") {
      setShowMoliendaModal(true);
      return;
    }

    if (!user) {
      setPendingService({ id: serviceId, name: serviceName });
      setShowLogin(true);
    } else {
      generateServiceQuote(user, serviceId, serviceName);
    }
  };

  return (
    <>
      <section id="servicios" className="w-full scroll-mt-24 mb-10">
        <div className="max-w-7xl mx-auto px-4 md:px-8 pb-10">

          {/* Header de sección */}
          <div className="flex flex-col items-center text-center mb-10">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold tracking-widest uppercase px-3 py-1.5 rounded-full mb-4"
              style={{ background: "var(--accent-light)", color: "var(--accent)" }}>
              ⚙️ Servicios
            </span>
            <h2 className="text-3xl md:text-4xl font-black tracking-tight"
              style={{ color: "var(--primary)" }}>
              Nuestros Servicios
            </h2>
            <p className="text-slate-500 mt-2 max-w-lg text-sm">
              Solicita una cotización personalizada para cualquiera de nuestros servicios industriales.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {SERVICES.map((service) => (
              <div
                key={service.id}
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
                {/* Franja superior de color */}
                <div className="h-1.5 w-full" style={{ background: "var(--accent)" }} />

                <div className="flex flex-col items-center p-7 gap-5">
                  {/* Tag + Emoji */}
                  <div className="flex flex-col items-center gap-3">
                    <span className="text-xs font-bold tracking-widest uppercase px-3 py-1 rounded-full"
                      style={{ background: "var(--accent-light)", color: "var(--accent)" }}>
                      {service.tag}
                    </span>
                    <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-5xl"
                      style={{ background: "linear-gradient(135deg, #F0F4FF 0%, #E8F1FF 100%)" }}>
                      {service.emoji}
                    </div>
                  </div>

                  {/* Nombre y descripción */}
                  <div className="text-center">
                    <h3 className="font-black text-2xl mb-2"
                      style={{ color: "var(--primary)" }}>
                      {service.name}
                    </h3>
                    <p className="text-sm leading-relaxed"
                      style={{ color: "var(--muted-foreground)" }}>
                      {service.description}
                    </p>
                  </div>

                  {/* Botón */}
                  <button
                    onClick={() => handleQuoteClick(service.id, service.name)}
                    disabled={isGenerating}
                    className="w-full py-3 rounded-xl text-sm font-bold uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                    style={{ background: "var(--primary)", color: "white" }}
                    onMouseEnter={(e) => {
                      if (!isGenerating)
                        (e.currentTarget as HTMLButtonElement).style.background = "var(--primary-hover)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.background = "var(--primary)";
                    }}
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="animate-spin" size={16} />
                        Enviando...
                      </>
                    ) : (
                      "Solicitar cotización →"
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <LoginModal
        isOpen={showLogin}
        onClose={() => setShowLogin(false)}
        onSuccess={() => {
          setShowLogin(false);
          // Pequeño delay para que el store se actualice
          setTimeout(() => {
            const freshUser = useAuthStore.getState().user;
            if (pendingService) {
              generateServiceQuote(freshUser, pendingService.id, pendingService.name);
            }
          }, 100);
        }}
      />

      <MoliendaModal
        isOpen={showMoliendaModal}
        onClose={() => setShowMoliendaModal(false)}
      />
      
      <SuccessModal 
        isOpen={showSuccessModal} 
        onClose={() => setShowSuccessModal(false)} 
      />
    </>
  );
}
