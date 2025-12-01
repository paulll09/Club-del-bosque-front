import React, { useEffect } from "react";

function generarDiasProximos(cantidad) {
  const hoy = new Date();
  const diasSemana = ["DOM", "LUN", "MAR", "MIÉ", "JUE", "VIE", "SÁB"];
  const mesesCortos = ["ENE", "FEB", "MAR", "ABR", "MAY", "JUN", "JUL", "AGO", "SEP", "OCT", "NOV", "DIC"];

  const dias = [];
  for (let i = 0; i < cantidad; i++) {
    const d = new Date(hoy);
    d.setDate(hoy.getDate() + i);

    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    const valor = `${year}-${month}-${day}`;
    
    dias.push({
      valor,
      diaSemana: diasSemana[d.getDay()],
      numeroDia: day,
      mesCorto: mesesCortos[d.getMonth()],
    });
  }
  return dias;
}

export default function SelectorDiaCarrusel({ fechaSeleccionada, onSeleccionarFecha }) {
  // Generamos 15 días para dar más libertad al usuario
  const dias = generarDiasProximos(15);

  // --- LÓGICA DE AUTO-SELECCIÓN ---
  useEffect(() => {
    // Si no hay fecha seleccionada (es la primera carga), seleccionamos la primera (HOY)
    if (!fechaSeleccionada && dias.length > 0) {
      onSeleccionarFecha(dias[0].valor);
    }
  }, [fechaSeleccionada, onSeleccionarFecha, dias]);

  return (
    // Agregamos 'pt-2 px-2 pb-4' para dar espacio a la animación de escala y sombra sin que se corte
    <div className="flex gap-3 overflow-x-auto pt-2 px-2 pb-4 no-scrollbar snap-x snap-mandatory">
      {dias.map((dia) => {
        const seleccionado = fechaSeleccionada === dia.valor;
        
        return (
          <button
            key={dia.valor}
            type="button"
            onClick={() => onSeleccionarFecha(dia.valor)}
            className={`
              relative min-w-[72px] flex flex-col items-center justify-center rounded-2xl border transition-all duration-300 snap-start
              ${seleccionado
                ? "bg-emerald-500 text-slate-950 border-emerald-400 shadow-lg shadow-emerald-500/25 scale-110 z-10"
                : "bg-slate-900/50 text-slate-400 border-slate-700 hover:border-slate-500 hover:bg-slate-800"
              }
              py-3
            `}
          >
            {/* Día de la semana (LUN, MAR...) */}
            <span className="text-[10px] font-bold uppercase tracking-wider mb-0.5 opacity-90">
              {dia.diaSemana}
            </span>
            
            {/* Número del día (27, 28...) */}
            <span className="text-2xl font-black leading-none tracking-tight">
              {dia.numeroDia}
            </span>

            {/* Mes (NOV, DIC...) */}
            <span className="text-[9px] font-medium mt-1 opacity-75">
              {dia.mesCorto}
            </span>
            
            {/* Pequeño detalle visual si está seleccionado */}
            {seleccionado && (
                <div className="absolute -bottom-1 w-1 h-1 bg-slate-950/30 rounded-full"></div>
            )}
          </button>
        );
      })}
    </div>
  );
}