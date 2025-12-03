import React from "react";

export default function ListaHorarios({
  horarios,
  fechaSeleccionada,
  estaReservado,
  esHorarioPasado,
  esBloqueado,
  seleccionarHorario,
}) {
  if (!fechaSeleccionada) {
    return (
      <div className="text-center py-8 border-2 border-dashed border-slate-800 rounded-2xl bg-slate-900/30">
        <p className="text-2xl mb-2">📅</p>
        <p className="text-sm text-slate-400">
          Seleccioná una fecha arriba
          <br />
          para ver los turnos.
        </p>
      </div>
    );
  }

  // Para calcular si hay pocos horarios disponibles y agrandar la grilla
  const disponibilidadLibre = (h) => {
    const reservado = estaReservado ? estaReservado(h) : false;
    const bloqueado = esBloqueado ? esBloqueado(h) : false;
    const pasado = esHorarioPasado ? esHorarioPasado(h) : false;
    return !reservado && !bloqueado && !pasado;
  };

  const horariosDisponibles = horarios.filter(disponibilidadLibre);
  const pocosHorarios = horariosDisponibles.length <= 3;
  const claseGrid = pocosHorarios ? "grid-cols-2" : "grid-cols-3";

  return (
    <div className={`grid ${claseGrid} gap-3`}>
      {horarios.map((hora) => {
        const reservado = estaReservado ? estaReservado(hora) : false;
        const bloqueado = esBloqueado ? esBloqueado(hora) : false;
        const pasado = esHorarioPasado ? esHorarioPasado(hora) : false;

        const deshabilitado = reservado || bloqueado || pasado;

        let etiquetaTexto = "Libre";
        let etiquetaClase = "text-emerald-400/80";
        let horaClase = "text-lg font-bold tracking-tight";

        if (bloqueado) {
          etiquetaTexto = "Bloqueado";
          etiquetaClase = "text-orange-400/90";
          horaClase =
            "text-lg font-bold tracking-tight line-through opacity-70";
        } else if (reservado) {
          etiquetaTexto = "Ocupado";
          etiquetaClase = "text-red-400/90";
          horaClase = "text-xs line-through opacity-60";
        } else if (pasado) {
          etiquetaTexto = "Pasado";
          etiquetaClase = "text-slate-500";
          horaClase = "text-xs line-through opacity-60";
        }

        return (
          <button
            key={hora}
            type="button"
            onClick={() => !deshabilitado && seleccionarHorario(hora)}
            disabled={deshabilitado}
            className={`
              relative aspect-[4/3] rounded-xl border text-sm font-medium flex flex-col items-center justify-center gap-1
              transition-all duration-200
              ${
                deshabilitado
                  ? "bg-slate-950/60 text-slate-600 border-slate-800 cursor-not-allowed grayscale"
                  : "bg-slate-800 text-emerald-50 border-slate-700 hover:bg-emerald-600 hover:border-emerald-500 hover:shadow-lg hover:scale-105 active:scale-95"
              }
            `}
          >
            <span className={horaClase}>{hora}</span>
            <span
              className={`text-[9px] font-bold uppercase tracking-wider ${etiquetaClase}`}
            >
              {etiquetaTexto}
            </span>
          </button>
        );
      })}
    </div>
  );
}

