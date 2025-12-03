import React, { useMemo } from "react";

/**
 * Vista calendario del panel admin.
 *
 * Muestra una tabla con:
 *  - Filas: horas
 *  - Columnas: canchas
 *  - Celdas: reservas (o "Libre" si no hay)
 *
 * Props:
 * - reservas: array de reservas ya filtradas
 * - fechaAdmin: string (YYYY-MM-DD) que indica la fecha base de la vista
 * - configClub: objeto de configuración (hora_apertura, hora_cierre, etc.)
 */
export default function CalendarioAdmin({ reservas, fechaAdmin, configClub }) {
  /**
   * Helper: indica si la jornada del club cruza medianoche.
   */
  const cruzaMedianoche = useMemo(() => {
    if (!configClub?.hora_apertura || !configClub?.hora_cierre) return false;
    const [hA, mA] = configClub.hora_apertura.split(":").map(Number);
    const [hC, mC] = configClub.hora_cierre.split(":").map(Number);
    const ini = hA * 60 + mA;
    const fin = hC * 60 + mC;
    return fin <= ini;
  }, [configClub]);

  /**
   * Helper: convierte "HH:MM" a minutos, ajustando si cruza medianoche.
   * Si cruza medianoche, las horas menores a la apertura se consideran "día siguiente"
   * y se suman 24h para que al ordenar queden al final (después de 23:xx).
   */
  const valorOrdenHora = (horaStr) => {
    const [h, m] = horaStr.split(":").map(Number);
    const total = h * 60 + m;

    if (!configClub?.hora_apertura || !cruzaMedianoche) return total;

    const [hA, mA] = configClub.hora_apertura.split(":").map(Number);
    const aperturaMin = hA * 60 + mA;

    if (total < aperturaMin) {
      // madrugada del día siguiente
      return total + 24 * 60;
    }

    return total;
  };

  /**
   * Columnas: canchas únicas presentes en las reservas visibles.
   */
  const canchasUnicas = useMemo(() => {
    const ids = reservas
      .map((r) => r.id_cancha)
      .filter((v) => v !== null && v !== undefined);
    return Array.from(new Set(ids)).sort((a, b) => Number(a) - Number(b));
  }, [reservas]);

  /**
   * Filas: horas únicas presentes en las reservas visibles,
   * ordenadas respetando la jornada (incluyendo madrugada siguiente).
   */
  const horasUnicas = useMemo(() => {
    const hs = reservas
      .map((r) => (r.hora ? r.hora.slice(0, 5) : null))
      .filter(Boolean);
    const set = Array.from(new Set(hs));
    return set.sort((a, b) => valorOrdenHora(a) - valorOrdenHora(b));
  }, [reservas, configClub, cruzaMedianoche]);

  const obtenerReservaCelda = (hora, cancha) =>
    reservas.find(
      (r) =>
        String(r.id_cancha) === String(cancha) &&
        r.hora &&
        r.hora.slice(0, 5) === hora
    );

  if (reservas.length === 0) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
        <div className="flex.justify-between items-center mb-2">
          <h3 className="text-sm font-semibold text-slate-100">
            Calendario del día
          </h3>
          <p className="text-[11px] text-slate-400">
            {fechaAdmin} · Vista por cancha y hora
          </p>
        </div>
        <div className="text-center py-10 border-2 border-dashed border-slate-800 rounded-2xl opacity-60">
          <p className="text-slate-400 text-sm">
            No hay reservas para mostrar en esta fecha.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
      <div className="flex.justify-between items-center mb-2">
        <h3 className="text-sm font-semibold text-slate-100">
          Calendario del día
        </h3>
        <p className="text-[11px] text-slate-400">
          {fechaAdmin} · Vista por cancha y hora
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full.text-xs border-separate border-spacing-y-1">
          <thead>
            <tr>
              <th className="text-left text-[10px] text-slate-500 uppercase tracking-wider px-2">
                Hora
              </th>
              {canchasUnicas.map((cancha) => (
                <th
                  key={`head-cancha-${cancha}`}
                  className="text-center text-[10px] text-slate-400 uppercase tracking-wider px-2"
                >
                  Cancha {cancha}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {horasUnicas.map((hora) => (
              <tr key={`fila-hora-${hora}`}>
                <td className="align-top px-2 py-1 text-[11px] text-slate-300 font-mono">
                  <span>{hora}</span>
                </td>
                {canchasUnicas.map((cancha) => {
                  const r = obtenerReservaCelda(hora, cancha);

                  if (!r) {
                    return (
                      <td
                        key={`celda-${hora}-${cancha}`}
                        className="align-top px-2 py-1"
                      >
                        <div className="border border-dashed border-slate-800 rounded-lg h-12 flex items-center justify-center text-[10px] text-slate-500">
                          Libre
                        </div>
                      </td>
                    );
                  }

                  const esCancelada = r.estado === "cancelada";
                  const esConfirmada = r.estado === "confirmada";

                  const bg = esCancelada
                    ? "bg-red-900/20 border-red-500/30"
                    : esConfirmada
                    ? "bg-emerald-900/20 border-emerald-500/30"
                    : "bg-sky-900/20 border-sky-500/30";

                  const txt = esCancelada
                    ? "text-red-300"
                    : esConfirmada
                    ? "text-emerald-300"
                    : "text-sky-300";

                  return (
                    <td
                      key={`celda-${hora}-${cancha}`}
                      className="align-top px-2 py-1"
                    >
                      <div
                        className={`h-12 rounded-lg border ${bg} ${txt} px-2 py-1 flex flex-col justify-center`}
                      >
                        <span className="text-[11px] font-semibold truncate">
                          {r.nombre_cliente || "Sin nombre"}
                        </span>
                        <span className="text-[9px] opacity-80 truncate">
                          {r.telefono_cliente || ""}
                          {r.estado && ` · ${r.estado}`}
                        </span>
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
