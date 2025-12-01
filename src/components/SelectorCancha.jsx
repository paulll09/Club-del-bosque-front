import React from "react";

export default function SelectorCancha({ canchas = [], canchaSeleccionada, onSeleccionarCancha }) {
  // Validación de seguridad: Si 'canchas' no es un array, no renderizamos nada para evitar el error.
  if (!Array.isArray(canchas)) {
    console.warn("⚠️ SelectorCancha recibió datos inválidos:", canchas);
    return null;
  }

  return (
    <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
      {canchas.map((cancha) => {
        // Aseguramos que la comparación sea entre strings para evitar bugs de tipos (1 vs "1")
        const activa = String(canchaSeleccionada) === String(cancha.id);
        
        return (
          <button
            key={cancha.id}
            type="button"
            onClick={() => onSeleccionarCancha(cancha.id)}
            className={`
              min-w-[140px] text-left rounded-2xl px-4 py-3 border transition-all duration-300 relative overflow-hidden group
              flex flex-col justify-between h-24
              ${activa
                  ? "bg-emerald-500 text-slate-950 border-emerald-400 shadow-lg"
                  : "bg-slate-900 text-slate-100 border-slate-800 hover:border-emerald-500/50 hover:bg-slate-800"
              }
            `}
          >
            {/* Decoración fondo */}
            <div className={`absolute -right-4 -bottom-4 w-16 h-16 rounded-full opacity-20 transition-transform group-hover:scale-150 ${activa ? 'bg-white' : 'bg-emerald-500'}`}></div>

            <span className="text-sm font-bold z-10">{cancha.nombre}</span>
            <span className={`text-[10px] z-10 font-medium ${activa ? "text-emerald-900" : "text-slate-400"}`}>
              {cancha.descripcion}
            </span>
          </button>
        );
      })}
    </div>
  );
}