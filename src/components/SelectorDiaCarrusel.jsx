// src/components/SelectorDiaCarrusel.jsx
import React, { useEffect } from "react";

function generarDiasProximos(cantidad) {
  const hoy = new Date();
  const diasSemana = ["DOM", "LUN", "MAR", "MIÉ", "JUE", "VIE", "SÁB"];
  const mesesCortos = [
    "ENE",
    "FEB",
    "MAR",
    "ABR",
    "MAY",
    "JUN",
    "JUL",
    "AGO",
    "SEP",
    "OCT",
    "NOV",
    "DIC",
  ];

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

export default function SelectorDiaCarrusel({
  fechaSeleccionada,
  onSeleccionarFecha,
}) {
  const dias = generarDiasProximos(15);

  // Auto-selección inicial
  useEffect(() => {
    if (!fechaSeleccionada && dias.length > 0) {
      onSeleccionarFecha(dias[0].valor);
    }
  }, [fechaSeleccionada, dias, onSeleccionarFecha]);

  return (
    <div className="flex gap-3 overflow-x-auto pt-2 px-1 pb-4 no-scrollbar snap-x snap-mandatory">
      {dias.map((dia) => {
        const seleccionado = fechaSeleccionada === dia.valor;

        return (
          <button
            key={dia.valor}
            type="button"
            onClick={() => onSeleccionarFecha(dia.valor)}
            className={`relative min-w-[72px] flex flex-col items-center justify-center rounded-2xl border snap-start py-3 transition-all duration-200
              ${
                seleccionado
                  ? "bg-emerald-500 text-slate-950 border-emerald-400 scale-105"
                  : "bg-slate-900 text-slate-300 border-slate-700 hover:border-slate-500 hover:bg-slate-800"
              }
            `}
          >
            {/* Día de la semana */}
            <span
              className={`text-[10px] font-semibold uppercase tracking-wider mb-1 ${
                seleccionado ? "text-slate-950" : "text-slate-400"
              }`}
            >
              {dia.diaSemana}
            </span>

            {/* Número del día */}
            <span
              className={`text-[22px] font-bold leading-none tracking-tight ${
                seleccionado ? "text-slate-950" : "text-slate-100"
              }`}
            >
              {dia.numeroDia}
            </span>

            {/* Mes */}
            <span
              className={`text-[10px] font-medium mt-1 ${
                seleccionado ? "text-slate-900/80" : "text-slate-400/80"
              }`}
            >
              {dia.mesCorto}
            </span>

            {/* Indicador simple bajo el seleccionado */}
            {seleccionado && (
              <div className="absolute -bottom-1 w-6 h-[2px] rounded-full bg-slate-950/70" />
            )}
          </button>
        );
      })}
    </div>
  );
}
