import React from "react";

/**
 * Tarjetas de métricas rápidas del panel admin.
 *
 * Props:
 * - estadisticas: objeto con { total, activas, canceladas, confirmadas, pendientes }
 */
export default function EstadisticasAdmin({ estadisticas }) {
  return (
    <div className="grid grid-cols-4 gap-3">
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex flex-col items-center justify-center">
        <span className="text-2xl font-bold text-white mb-1">
          {estadisticas.total}
        </span>
        <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">
          Total
        </span>
      </div>
      <div className="bg-emerald-900/10 border border-emerald-500/20 p-4 rounded-2xl flex flex-col items-center justify-center">
        <span className="text-2xl font-bold text-emerald-400 mb-1">
          {estadisticas.activas}
        </span>
        <span className="text-[10px] text-emerald-500/70 uppercase font-bold tracking-wider">
          Activas
        </span>
      </div>
      <div className="bg-sky-900/10 border border-sky-500/20 p-4 rounded-2xl flex flex-col items-center justify-center">
        <span className="text-2xl font-bold text-sky-400 mb-1">
          {estadisticas.confirmadas}
        </span>
        <span className="text-[10px] text-sky-500/70 uppercase font-bold tracking-wider">
          Confirmadas
        </span>
      </div>
      <div className="bg-red-900/10 border border-red-500/20 p-4 rounded-2xl flex flex-col items-center justify-center">
        <span className="text-2xl font-bold text-red-400 mb-1">
          {estadisticas.canceladas}
        </span>
        <span className="text-[10px] text-red-500/70 uppercase font-bold tracking-wider">
          Canceladas
        </span>
      </div>
    </div>
  );
}
