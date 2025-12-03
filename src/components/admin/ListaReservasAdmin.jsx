import React from "react";

/**
 * Lista de reservas en formato "tarjetas".
 *
 * Props:
 * - reservas: array de reservas ya filtradas
 * - onCancelar: función (id) => void
 * - onEliminar: función (id) => void
 */
export default function ListaReservasAdmin({
  reservas,
  onCancelar,
  onEliminar,
}) {
  if (reservas.length === 0) {
    return (
      <div className="space-y-3">
        <div className="text-center py-16 border-2 border-dashed border-slate-800 rounded-3xl opacity-50">
          <p className="text-slate-400 text-sm">No hay reservas para mostrar</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {reservas.map((reserva) => {
        const esCancelada = reserva.estado === "cancelada";

        return (
          <div
            key={reserva.id}
            className={`relative p-5 rounded-2xl border transition-all duration-300 group ${
              esCancelada
                ? "bg-slate-950 border-slate-800/50.opacity-60 hover:opacity-100"
                : "bg-slate-900 border-slate-700 hover:border-emerald-500/40 shadow-lg"
            }`}
          >
            {/* Hora + Cancha */}
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <span
                  className={`text-2xl font-black tracking-tight ${
                    esCancelada ? "text-slate-500 line-through" : "text-white"
                  }`}
                >
                  {reserva.hora?.slice(0, 5)}
                </span>

                <span
                  className={`text-[10px] px-2 py-1 rounded-md font-bold uppercase tracking-wider ${
                    esCancelada
                      ? "bg-red-500/10 text-red-500 border border-red-500/20"
                      : "bg-slate-800 text-slate-300 border border-slate-700"
                  }`}
                >
                  Cancha {reserva.id_cancha}
                </span>
              </div>

              {esCancelada && (
                <span className="text-[10px] font-bold text-red-500 uppercase tracking-widest bg-red-900/10 px-2 py-1 rounded border border-red-500/10">
                  Cancelada
                </span>
              )}
            </div>

            {/* Datos + Acciones */}
            <div className="flex justify-between items-end">
              <div className="space-y-1">
                <p
                  className={`text-sm font-semibold flex.items-center gap-2 ${
                    esCancelada ? "text-slate-500" : "text-emerald-300"
                  }`}
                >
                  <svg
                    className="w-4 h-4 opacity-70"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  {reserva.nombre_cliente || "Sin Nombre"}
                </p>

                <p className="text-xs text-slate-500 flex.items-center gap-2 font-mono">
                  <svg
                    className="w-3 h-3.opacity-50"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  {reserva.telefono_cliente || "---"}
                </p>
              </div>

              <div className="flex gap-2">
                {!esCancelada ? (
                  <button
                    onClick={() => onCancelar(reserva.id)}
                    className="text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 px-4.py-2 rounded-lg border border-slate-700 hover:border-slate-600 transition-all"
                  >
                    Cancelar
                  </button>
                ) : (
                  <button
                    onClick={() => onEliminar(reserva.id)}
                    className="text-xs font-semibold bg-red-900/10 hover:bg-red-900/30 text-red-400 px-4 py-2 rounded-lg border border-red-500/20 hover:border-red-500/40 transition-all flex.items-center gap-2"
                  >
                    Borrar
                  </button>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
