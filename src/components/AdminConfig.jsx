import React, { useEffect, useState } from "react";

/**
 * Vista de configuración general del sistema.
 *
 * Permite:
 *  - Ver el precio de la seña.
 *  - Ver horarios de apertura/cierre.
 *  - Ver duración del turno.
 *  - Modificar y guardar estos valores.
 */
export default function AdminConfig({ apiUrl, adminToken }) {
  const [cargando, setCargando] = useState(false);
  const [guardando, setGuardando] = useState(false);

  const [precioSenia, setPrecioSenia] = useState("");
  const [horaApertura, setHoraApertura] = useState("");
  const [horaCierre, setHoraCierre] = useState("");
  const [duracionTurno, setDuracionTurno] = useState("");

  const cargarConfig = async () => {
    if (!adminToken) return;

    setCargando(true);
    try {
      const res = await fetch(`${apiUrl}/admin/config`, {
        headers: {
          "X-Admin-Token": adminToken,
        },
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        alert(data.mensaje || "No se pudo cargar la configuración.");
        return;
      }

      const data = await res.json();

      setPrecioSenia(data.precio_senia ?? "");
      setHoraApertura(data.hora_apertura ?? "");
      setHoraCierre(data.hora_cierre ?? "");
      setDuracionTurno(data.duracion_turno_minutos ?? "");
    } catch (error) {
      console.error("Error al cargar configuración:", error);
      alert("Error de conexión.");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarConfig();
  }, [adminToken]);

  const guardarConfig = async (e) => {
    e.preventDefault();
    if (!adminToken) return;

    setGuardando(true);
    try {
      const cuerpo = {
        precio_senia: Number(precioSenia) || 0,
        hora_apertura: horaApertura,
        hora_cierre: horaCierre,
        duracion_turno_minutos: Number(duracionTurno) || 60,
      };

      const res = await fetch(`${apiUrl}/admin/config`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Admin-Token": adminToken,
        },
        body: JSON.stringify(cuerpo),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        alert(data.mensaje || "No se pudo guardar la configuración.");
        return;
      }

      alert(data.mensaje || "Configuración guardada correctamente.");
    } catch (error) {
      console.error("Error al guardar configuración:", error);
      alert("Error de conexión.");
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="pb-2 border-b border-slate-800/50">
        <h2 className="text-xl font-bold text-white">Configuración general</h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Ajustes de precio de seña y horarios de funcionamiento del club.
        </p>
      </div>

      <form
        onSubmit={guardarConfig}
        className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-4"
      >
        {cargando && (
          <p className="text-xs text-slate-400 mb-2">
            Cargando configuración...
          </p>
        )}

        {/* Precio seña */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">
            Precio de la seña (ARS)
          </label>
          <input
            type="number"
            min="0"
            step="10"
            value={precioSenia}
            onChange={(e) => setPrecioSenia(e.target.value)}
            className="w-full text-sm bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            placeholder="Monto de la seña"
          />
          <p className="text-[10px] text-slate-500 mt-1">
            Este valor se utiliza como monto a cobrar en Mercado Pago por cada reserva.
          </p>
        </div>

        {/* Horarios */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Hora de apertura
            </label>
            <input
              type="time"
              value={horaApertura}
              onChange={(e) => setHoraApertura(e.target.value)}
              className="w-full text-sm bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Hora de cierre
            </label>
            <input
              type="time"
              value={horaCierre}
              onChange={(e) => setHoraCierre(e.target.value)}
              className="w-full text-sm bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>
        </div>

        {/* Duración turno */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">
            Duración del turno (minutos)
          </label>
          <input
            type="number"
            min="30"
            step="15"
            value={duracionTurno}
            onChange={(e) => setDuracionTurno(e.target.value)}
            className="w-full text-sm bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            placeholder="Ej: 60"
          />
          <p className="text-[10px] text-slate-500 mt-1">
            Este valor se puede usar más adelante para generar automáticamente los horarios disponibles.
          </p>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={guardando}
            className="px-4 py-2 text-xs font-semibold rounded-xl bg-emerald-500 hover:bg-emerald-600 disabled:opacity-60 disabled:cursor-not-allowed text-white transition-colors"
          >
            {guardando ? "Guardando..." : "Guardar cambios"}
          </button>
        </div>
      </form>
    </div>
  );
}
