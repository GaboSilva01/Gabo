"use client";

import { useState } from 'react';
import { useCartStore } from '@/store/useCartStore';
import { useAuthStore } from '@/store/useAuthStore';
import { X, Minus, Plus, Trash2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LoginModal } from '@/components/auth/LoginModal';
import { SuccessModal } from './SuccessModal';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export function CartSidebar() {
  const { items, isOpen, closeCart, updateQuantity, removeItem, clearCart } = useCartStore();
  const { user } = useAuthStore();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // Función para cargar el logo en base64
  const loadLogoAsBase64 = (): Promise<string> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = '/logo.svg';
      img.onload = () => {
        const canvas = document.createElement('canvas');
        // Reducir la resolución del logo para que el PDF no pese varios Megabytes
        const MAX_WIDTH = 400;
        const scale = (img.width && img.width > MAX_WIDTH) ? MAX_WIDTH / img.width : 1;
        canvas.width = (img.width * scale) || 200;
        canvas.height = (img.height * scale) || 60;
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

  const generatePDF = async () => {
    if (!user) return;
    setIsGenerating(true);

    try {
      const doc = new jsPDF();
      
      const logoBase64 = await loadLogoAsBase64();
      
      // Header (Logo or Text)
      if (logoBase64) {
        doc.addImage(logoBase64, 'PNG', 14, 15, 50, 15);
      } else {
        doc.setFontSize(22);
        doc.text('Cotización Coveplast', 14, 25);
      }
      
      // Client info
      doc.setFontSize(12);
      doc.text(`Empresa: ${user.companyName}`, 14, 40);
      doc.text(`Correo: ${user.email}`, 14, 46);
      doc.text(`Teléfono: ${user.phone}`, 14, 52);
      doc.text(`Fecha: ${new Date().toLocaleDateString()}`, 14, 58);

      // Table
      const tableData = items.map(item => {
        let name = item.product.name;
        if (item.customOptions) {
          const opts = [];
          if (item.customOptions.cuneteType) opts.push(`Tipo: ${item.customOptions.cuneteType}`);
          if (item.customOptions.cajetinShape) opts.push(`Forma: ${item.customOptions.cajetinShape}`);
          if (item.customOptions.needsLid) {
            opts.push(`Con tapa${item.customOptions.lidType ? ` (${item.customOptions.lidType})` : ""}`);
          }
          if (item.customOptions.wantsPersonalization) {
            opts.push(`Pers: ${item.customOptions.pantoneColor || "Sin color"}`);
          }
          if (opts.length > 0) {
            name += `\n[${opts.join(" | ")}]`;
          }
        }
        return [
          name,
          item.quantity.toString()
        ];
      });

      autoTable(doc, {
        startY: 65,
        head: [['Producto', 'Cantidad solicitada']],
        body: tableData,
        theme: 'grid',
        headStyles: { fillColor: [41, 128, 185] },
      });

      // Obtener el base64 limpio directamente del datauristring
      const dataUri = doc.output('datauristring');
      const pdfBase64 = dataUri.split(',')[1];

      // Guardar PDF localmente (descarga directa)
      doc.save(`Cotizacion_${user.companyName.replace(/\s+/g, '_')}.pdf`);

      // Intentar enviar al API de correo de respaldo
      try {
        const response = await fetch('/api/quotation', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            user,
            pdfData: pdfBase64
          }),
        });
        if (!response.ok) {
          const errData = await response.json();
          alert(`Error enviando correo: ${errData.error || response.status}`);
        }
      } catch (apiError: any) {
        alert(`Error de red al enviar correo: ${apiError.message}`);
      }

      setShowSuccessModal(true);
      clearCart();
      closeCart();
    } catch (error) {
      console.error(error);
      alert('Hubo un error al generar tu cotización. Intenta de nuevo.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCheckoutClick = () => {
    if (!user) {
      setShowLoginModal(true);
    } else {
      generatePDF();
    }
  };

  // Solo renderiza el sidebar o sus modales, pero SuccessModal debe poder mostrarse 
  // incluso si isOpen es false (ya que cerramos el cart al mostrarlo)
  return (
    <>
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/50 z-40 transition-opacity" 
            onClick={closeCart}
          />
          
          {/* Sidebar */}
          <div className="fixed top-0 right-0 h-full w-full sm:w-[400px] bg-white z-50 shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out">
            <div className="p-4 flex items-center justify-between border-b">
              <h2 className="text-xl font-bold">Carrito de Cotización</h2>
              <button onClick={closeCart} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
              {items.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-gray-500">
                  <p>Tu carrito está vacío.</p>
                  <Button onClick={closeCart} variant="outline" className="mt-4">
                    Seguir viendo
                  </Button>
                </div>
              ) : (
                items.map((item, index) => (
                  <div key={`${item.product.id}-${index}`} className="flex gap-4 border-b pb-4">
                    <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden p-2">
                      <img 
                        src={item.product.imageUrl} 
                        alt={item.product.name}
                        className="w-full h-full object-contain mix-blend-multiply"
                      />
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="font-semibold text-sm">{item.product.name}</h3>
                        {item.customOptions && (
                          <div className="text-[10px] text-gray-500 mt-0.5 leading-tight space-y-0.5">
                            {item.customOptions.cuneteType && <span className="block">• Tipo: {item.customOptions.cuneteType}</span>}
                            {item.customOptions.cajetinShape && <span className="block">• Forma: {item.customOptions.cajetinShape}</span>}
                            {item.customOptions.needsLid && (
                              <span className="block">
                                • Con tapa {item.customOptions.lidType && `(${item.customOptions.lidType})`}
                              </span>
                            )}
                            {item.customOptions.wantsPersonalization && (
                              <span className="block">• Pers: {item.customOptions.pantoneColor || "Sin color"}</span>
                            )}
                          </div>
                        )}
                        <p className="text-gray-400 text-[10px] mt-1">Pedido mín: {item.product.minOrder.toLocaleString()} unid.</p>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-2 border rounded-md px-2 py-1">
                          <button 
                            onClick={() => {
                              if (item.quantity > item.product.minOrder) updateQuantity(item.product.id, item.quantity - 100, item.customOptions);
                            }}
                            className="text-gray-500 hover:text-black"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="text-sm w-8 text-center">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.product.id, item.quantity + 100, item.customOptions)}
                            className="text-gray-500 hover:text-black"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                        <button 
                          onClick={() => removeItem(item.product.id, item.customOptions)}
                          className="text-red-500 hover:text-red-700 p-1"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {items.length > 0 && (
              <div className="border-t p-4 bg-gray-50">
                <div className="flex justify-between items-center mb-4 text-sm text-gray-500">
                  <span>Productos en cotización: {items.length}</span>
                  <span>{items.reduce((acc, item) => acc + item.quantity, 0).toLocaleString()} unidades</span>
                </div>
                <Button
                  onClick={handleCheckoutClick}
                  disabled={isGenerating}
                  className="w-full h-12 text-lg font-bold tracking-wide bg-black hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="animate-spin" size={20} />
                      Generando...
                    </>
                  ) : (
                    "Generar Cotización"
                  )}
                </Button>
              </div>
            )}
          </div>
        </>
      )}

      <LoginModal 
        isOpen={showLoginModal} 
        onClose={() => setShowLoginModal(false)}
        onSuccess={() => {
          setShowLoginModal(false);
          generatePDF();
        }}
      />
      
      <SuccessModal 
        isOpen={showSuccessModal} 
        onClose={() => setShowSuccessModal(false)} 
      />
    </>
  );
}
