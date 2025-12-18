// src/components/ModalConfirmacion.jsx
import React from "react";
import { HelpCircle, Clock3 } from "lucide-react";

export default function ModalConfirmacion({
  titulo,
  mensaje,
  onConfirm,
  onCancel,

  // NUEVO/OPCIONAL
  mostrarDuracion = false,
  duracionHoras = 1,
  setDuracionHoras = null,

  // ✅ NUEVO: si no se puede 2h, deshabilitamos el botón
  puede2h = true,
}) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 shadow-2xl w-full max-w-sm text-center transform transition-all scale-100">
        {/* Icono */}
        <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-700">
          <HelpCircle size={28} strokeWidth={2} className="text-emerald-400" />
        </div>

        <h3 className="text-lg font-bold text-white mb-2">{titulo}</h3>

        <p className="text-slate-400 text-sm mb-4 leading-relaxed whitespace-pre-line">
          {mensaje}
        </p>

        {/* Selector de duración */}
        {mostrarDuracion && typeof setDuracionHoras === "function" && (
          <div className="mb-5">
            <div className="flex items-center justify-center gap-2 text-xs text-slate-300 mb-2">
              <Clock3 size={16} className="text-emerald-300" />
              <span className="font-semibold">Duración</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setDuracionHoras(1)}
                className={`py-2 rounded-xl border text-sm font-semibold transition-all ${
                  duracionHoras === 1
                    ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-200"
                    : "bg-slate-950 border-slate-700 text-slate-300 hover:bg-slate-800"
                }`}
              >
                1 hora
              </button>

              <button
                type="button"
                disabled={!puede2h}
                onClick={() => setDuracionHoras(2)}
                className={`py-2 rounded-xl border text-sm font-semibold transition-all ${
                  !puede2h
                    ? "bg-slate-950 border-slate-800 text-slate-600 cursor-not-allowed opacity-60"
                    : duracionHoras === 2
                    ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-200"
                    : "bg-slate-950 border-slate-700 text-slate-300 hover:bg-slate-800"
                }`}
                title={!puede2h ? "No hay 2 horas consecutivas disponibles desde este horario." : ""}
              >
                2 horas
              </button>
            </div>

            <p className="text-[10px] text-slate-500 mt-2">
              Para 2 horas, el sistema reserva dos turnos consecutivos (ej: 18:00 y 19:00).
            </p>
          </div>
        )}

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
