import React from "react";

export default function ListaHorarios({ horarios, fechaSeleccionada, estaReservado, seleccionarHorario }) {
  if (!fechaSeleccionada) {
    return (
      <div className="text-center py-8 border-2 border-dashed border-slate-800 rounded-2xl bg-slate-900/30">
        <p className="text-2xl mb-2">📅</p>
        <p className="text-sm text-slate-400">Seleccioná una fecha arriba<br/>para ver los turnos.</p>
      </div>
    );
  }

  const horariosDisponibles = horarios.filter((h) => !estaReservado(h));
  const pocosHorarios = horariosDisponibles.length <= 3;
  const claseGrid = pocosHorarios ? "grid-cols-2" : "grid-cols-3";

  return (
    <div className={`grid ${claseGrid} gap-3`}>
      {horarios.map((hora) => {
        const reservado = estaReservado(hora);
        return (
          <button
            key={hora}
            type="button"
            onClick={() => !reservado && seleccionarHorario(hora)}
            disabled={reservado}
            className={`
              relative aspect-[4/3] rounded-xl border text-sm font-medium flex flex-col items-center justify-center gap-1
              transition-all duration-200
              ${reservado
                ? "bg-slate-950/50 text-slate-600 border-slate-800 cursor-not-allowed grayscale"
                : "bg-slate-800 text-emerald-50 border-slate-700 hover:bg-emerald-600 hover:border-emerald-500 hover:shadow-lg hover:scale-105 active:scale-95"
              }
            `}
          >
             {reservado ? (
                 <>
                    <span className="text-xs line-through opacity-50">{hora}</span>
                    <span className="text-[9px] font-bold uppercase tracking-wider text-red-900 bg-red-500/20 px-2 py-0.5 rounded">Ocupado</span>
                 </>
             ) : (
                 <>
                    <span className="text-lg font-bold tracking-tight">{hora}</span>
                    <span className="text-[9px] text-emerald-400/80 uppercase">Libre</span>
                 </>
             )}
          </button>
        );
      })}
    </div>
  );
}