import React, { useEffect, useState } from "react";

export default function WeatherWidget() {
  const [clima, setClima] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    // Coordenadas de Las Lomitas, Formosa, Argentina
    const LAT = -24.70;
    const LON = -60.59;
    
    // API Gratuita de Open-Meteo (No requiere Key)
    // Pedimos clima actual y zona horaria automática
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${LAT}&longitude=${LON}&current_weather=true&timezone=auto`;

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setClima(data.current_weather);
        setCargando(false);
      })
      .catch((e) => {
        console.error("Error obteniendo clima:", e);
        setCargando(false);
      });
  }, []);

  // Función para elegir el icono (Emoji) según el código WMO del clima
  const getIcono = (codigo) => {
    if (codigo === 0) return "☀️"; // Despejado
    if (codigo >= 1 && codigo <= 3) return "⛅"; // Nublado parcial
    if (codigo >= 45 && codigo <= 48) return "🌫️"; // Niebla
    if (codigo >= 51 && codigo <= 67) return "🌧️"; // Lluvia
    if (codigo >= 80 && codigo <= 99) return "⛈️"; // Tormenta / Granizo
    return "🌡️"; // Default
  };

  if (cargando) {
    // Skeleton loader (animación de carga)
    return <div className="animate-pulse bg-white/10 h-8 w-24 rounded-full"></div>;
  }

  if (!clima) return null;

  return (
    <div className="flex items-center gap-2 bg-slate-900/60 backdrop-blur-md border border-emerald-500/30 px-4 py-1.5 rounded-full shadow-lg transform hover:scale-105 transition-all cursor-default select-none">
      {/* Icono del clima */}
      <span className="text-lg leading-none filter drop-shadow-md" role="img" aria-label="clima">
        {getIcono(clima.weathercode)}
      </span>
      
      {/* Temperatura y Ubicación */}
      <div className="flex flex-col leading-none text-left">
        <span className="text-xs font-bold text-white">
          {Math.round(clima.temperature)}°C
        </span>
        <span className="text-[9px] text-emerald-400/80 uppercase tracking-wider font-semibold">
          Las Lomitas
        </span>
      </div>
    </div>
  );
}