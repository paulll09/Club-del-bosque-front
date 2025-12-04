// src/components/SelectorCancha.jsx
import React from "react";

export default function SelectorCancha({
  canchas = [],
  canchaSeleccionada,
  onSeleccionarCancha,
}) {
  if (!Array.isArray(canchas)) {
    console.warn("SelectorCancha recibió datos inválidos:", canchas);
    return null;
  }

  return (
    <div className="flex gap-3 overflow-x-auto px-4 pt-1 pb-2 no-scrollbar">
      {canchas.map((cancha) => {
        const activa = String(canchaSeleccionada) === String(cancha.id);

        return (
          <button
            key={cancha.id}
            type="button"
            onClick={() => onSeleccionarCancha(cancha.id)}
            className={`
              relative min-w-[150px] h-24 flex flex-col justify-center rounded-2xl border px-4 py-3 text-left
              transition-all duration-200
              ${
                activa
                  ? "bg-emerald-500 text-slate-950 border-emerald-400 scale-[1.03]"
                  : "bg-slate-900 text-slate-100 border-slate-700 hover:border-slate-500 hover:bg-slate-800"
              }
            `}
          >
            <span className="text-sm font-semibold truncate">
              {cancha.nombre || `Cancha ${cancha.id}`}
            </span>

            {cancha.descripcion && (
              <span
                className={`mt-1 text-[11px] leading-snug line-clamp-2 ${
                  activa ? "text-emerald-900/90" : "text-slate-400"
                }`}
              >
                {cancha.descripcion}
              </span>
            )}

            {activa && (
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-8 h-[2px] rounded-full bg-slate-950/70" />
            )}
          </button>
        );
      })}
    </div>
  );
}
