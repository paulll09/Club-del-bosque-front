import React from "react";

/**
 * Barra de selección de fecha + botón de recarga.
 *
 * Props:
 * - fechaAdmin: string (YYYY-MM-DD)
 * - onFechaChange: función para actualizar la fecha seleccionada
 * - cargando: boolean, indica si se están cargando reservas
 * - onRefrescar: función para recargar reservas manualmente
 */
export default function BarraFechaAdmin({
  fechaAdmin,
  onFechaChange,
  cargando,
  onRefrescar,
}) {
  return (
    <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex flex-col lg:flex-row gap-4 items-center justify-between shadow-lg">
      <div className="flex items-center gap-4 w-full lg:w-auto">
        <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-400 border border-emerald-500/20">
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <div className="flex-1">
          <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1">
            Fecha seleccionada
          </label>
          <input
            type="date"
            value={fechaAdmin}
            onChange={(e) => onFechaChange(e.target.value)}
            className="bg-transparent text-white font-bold text-lg focus:outline-none w-full cursor-pointer"
          />
        </div>
      </div>

      <button
        onClick={onRefrescar}
        className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all border border-slate-700"
        title="Actualizar lista"
      >
        <svg
          className={`w-5 h-5 ${cargando ? "animate-spin" : ""}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  );
}
