import React, { useEffect, useState } from "react";

export default function WeatherWidget() {
  const [clima, setClima] = useState(null);
  const [estado, setEstado] = useState("loading"); // loading | success | error

  const cargarClima = async () => {
    try {
      setEstado("loading");

      // Coordenadas: Las Lomitas, Formosa
      const LAT = -24.7;
      const LON = -60.59;

      const url = `https://api.open-meteo.com/v1/forecast?latitude=${LAT}&longitude=${LON}&current_weather=true&timezone=auto`;

      // Timeout para evitar colgado permanente
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 7000);

      const res = await fetch(url, { signal: controller.signal });

      clearTimeout(timeoutId);

      if (!res.ok) {
        throw new Error("Error al obtener clima");
      }

      const data = await res.json();

      if (!data.current_weather) {
        throw new Error("Respuesta sin datos de clima");
      }

      setClima(data.current_weather);
      setEstado("success");
    } catch (error) {
      console.error("Weather error:", error);
      setEstado("error");
    }
  };

  useEffect(() => {
    cargarClima();
  }, []);

  // Generador de íconos SVG según código WMO
  const getIcono = (codigo) => {
    // Clear
    if (codigo === 0) {
      return (
        <svg
          className="w-6 h-6 text-yellow-300"
          viewBox="0 0 24 24"
          stroke="currentColor"
          fill="none"
        >
          <circle cx="12" cy="12" r="5" strokeWidth="2" />
        </svg>
      );
    }

    // Parcial nublado
    if (codigo >= 1 && codigo <= 3) {
      return (
        <svg
          className="w-6 h-6 text-slate-200"
          viewBox="0 0 24 24"
          stroke="currentColor"
          fill="none"
        >
          <path
            strokeWidth="2"
            d="M3 15a4 4 0 014-4 5 5 0 019.58-1.26A4.5 4.5 0 1117 19H7a4 4 0 01-4-4z"
          />
        </svg>
      );
    }

    // Niebla
    if (codigo >= 45 && codigo <= 48) {
      return (
        <svg
          className="w-6 h-6 text-slate-200"
          viewBox="0 0 24 24"
          stroke="currentColor"
          fill="none"
        >
          <path strokeWidth="2" d="M3 12h18M4 16h16M6 20h12" />
        </svg>
      );
    }

    // Lluvia
    if (codigo >= 51 && codigo <= 67) {
      return (
        <svg
          className="w-6 h-6 text-blue-300"
          viewBox="0 0 24 24"
          stroke="currentColor"
          fill="none"
        >
          <path
            strokeWidth="2"
            d="M4 14a4 4 0 014-4 5 5 0 019.58-1.26A4.5 4.5 0 1117 18H7a4 4 0 01-3-4z"
          />
          <path strokeWidth="2" d="M9 20v2M13 19v2M17 20v2" />
        </svg>
      );
    }

    // Tormenta
    if (codigo >= 80 && codigo <= 99) {
      return (
        <svg
          className="w-6 h-6 text-yellow-300"
          viewBox="0 0 24 24"
          stroke="currentColor"
          fill="none"
        >
          <path
            strokeWidth="2"
            d="M7 14a4 4 0 014-4 5 5 0 019.58-1.26A4.5 4.5 0 0117 19H7a4 4 0 010-5z"
          />
          <path
            strokeWidth="2"
            d="M13 14l-2 4h3l-2 4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    }

    return null;
  };

  // Loading (skeleton)
  if (estado === "loading") {
    return (
      <div className="animate-pulse bg-white/10 h-8 w-24 rounded-full"></div>
    );
  }

  // Error con botón de reintentar
  if (estado === "error") {
    return (
      <button
        onClick={cargarClima}
        className="flex items-center gap-2 bg-slate-900/60 backdrop-blur-md border border-red-500/50 px-3 py-1.5 rounded-full text-[10px] text-red-300"
      >
        <span>Error clima</span>
        <span className="underline">Reintentar</span>
      </button>
    );
  }

  // Vista final
  return (
    <div className="flex items-center gap-2 bg-slate-900/60 backdrop-blur-md border border-emerald-500/30 px-4 py-1.5 rounded-full shadow-lg select-none">
      <span className="">{getIcono(clima.weathercode)}</span>

      <div className="flex flex-col leading-none">
        <span className="text-xs font-bold text-white">
          {Math.round(clima.temperature)}°C
        </span>
        <span className="text-[9px] text-emerald-400/80 uppercase tracking-wide font-semibold">
          Las Lomitas
        </span>
      </div>
    </div>
  );
}
