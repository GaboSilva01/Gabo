"use client";

import { useEffect, useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SuccessModal({ isOpen, onClose }: SuccessModalProps) {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setAnimate(true);
    } else {
      setAnimate(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      <div 
        className={`bg-white rounded-2xl w-full max-w-sm shadow-2xl p-8 text-center transform transition-all duration-500 ease-out flex flex-col items-center justify-center ${
          animate ? "scale-100 opacity-100 translate-y-0" : "scale-90 opacity-0 translate-y-8"
        }`}
      >
        <div className="relative mb-6">
          <div className="absolute inset-0 bg-green-100 rounded-full animate-ping opacity-75"></div>
          <div className="relative bg-green-100 text-green-600 rounded-full p-4 flex items-center justify-center z-10">
            <CheckCircle2 size={48} strokeWidth={2.5} className="animate-bounce" />
          </div>
        </div>
        
        <h3 className="text-2xl font-bold mb-3 text-gray-900">¡Cotización Generada!</h3>
        <p className="text-gray-600 mb-8 leading-relaxed font-medium">
          Su solicitud de cotización será respondida lo antes posible.
        </p>
        
        <Button 
          onClick={onClose} 
          className="w-full py-6 text-base font-bold bg-black hover:bg-gray-800 transition-colors"
        >
          Entendido
        </Button>
      </div>
    </div>
  );
}
