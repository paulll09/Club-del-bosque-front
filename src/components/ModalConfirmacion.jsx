// src/components/ModalConfirmacion.jsx
import React from "react";
import { HelpCircle } from "lucide-react";

export default function ModalConfirmacion({ titulo, mensaje, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 shadow-2xl w-full max-w-sm text-center transform transition-all scale-100">

        {/* Icono profesional */}
        <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-700">
          <HelpCircle size={28} strokeWidth={2} className="text-emerald-400" />
        </div>

        <h3 className="text-lg font-bold text-white mb-2">{titulo}</h3>

        <p className="text-slate-400 text-sm mb-6 leading-relaxed whitespace-pre-line">
          {mensaje}
        </p>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-3 rounded-xl border border-slate-700 text-slate-300 font-semibold hover:bg-slate-800 transition-colors text-sm"
          >
            Cancelar
          </button>

          <button
            onClick={onConfirm}
            className="flex-1 py-3 rounded-xl bg-emerald-500 text-slate-950 font-bold hover:bg-emerald-400 transition-colors text-sm shadow-lg shadow-emerald-500/20"
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
}
