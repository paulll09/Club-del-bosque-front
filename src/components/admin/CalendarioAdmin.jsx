import React, { useMemo } from "react";

/**
 * Calendario simple para el panel Admin.
 *
 * - Filas: horarios del día (según configClub)
 * - Columnas: canchas
 * - Celdas:
 *    - Reserva: "Reservado" + nombre (badge x2 si grupo de 2 horas)
 *    - Bloqueo fijo: "Fijo: nombre"
 *    - Libre
 *
 * Props:
 *  - reservas: array de reservas visibles para la fecha (pueden venir confirmadas/pendientes)
 *  - fechaAdmin: "YYYY-MM-DD"
 *  - configClub: { hora_apertura, hora_cierre, duracion_turno? }
 *  - bloqueosFijos: array de bloqueos fijos (dias_semana, hora_desde, hora_hasta, id_cancha, nombre, activo)
 */
export default function CalendarioAdmin({
  reservas = [],
  fechaAdmin,
  configClub,
  bloqueosFijos = [],
}) {
  const horaApertura = configClub?.hora_apertura || "14:00";
  const horaCierre = configClub?.hora_cierre || "02:00";

  // Si en tu config existe duracion_turno en minutos, lo usamos. Si no, 60.
  const intervaloMin = Number(configClub?.duracion_turno || 60);

  const weekdayISO = useMemo(() => {
    // ISO: 1=Lun ... 7=Dom
    if (!fechaAdmin) return null;
    const d = new Date(`${fechaAdmin}T00:00:00`);
    const jsDay = d.getDay(); // 0=Dom..6=Sab
    return jsDay === 0 ? 7 : jsDay;
  }, [fechaAdmin]);

  const normalizarHora = (h) => {
    if (!h) return "";
    // "HH:MM:SS" -> "HH:MM"
    return String(h).slice(0, 5);
  };

  const horaToMin = (hhmm) => {
    const [hh, mm] = String(hhmm).split(":").map(Number);
    return hh * 60 + mm;
  };

  const minToHora = (mins) => {
    const hh = Math.floor(mins / 60) % 24;
    const mm = mins % 60;
    return `${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}`;
  };

  const generarSlots = (apertura, cierre, stepMin) => {
    const a = horaToMin(apertura);
    const c = horaToMin(cierre);

    // Si c <= a, significa que cierra al día siguiente
    const end = c <= a ? c + 24 * 60 : c;

    const out = [];
    for (let t = a; t < end; t += stepMin) {
      out.push(minToHora(t));
    }
    return out;
  };

  const slots = useMemo(
    () => generarSlots(horaApertura, horaCierre, intervaloMin),
    [horaApertura, horaCierre, intervaloMin]
  );

  // Canchas visibles (si no vinieran en reservas, asumimos 1..3)
  const canchas = useMemo(() => {
    const ids = reservas
      .map((r) => Number(r.id_cancha))
      .filter((v) => Number.isFinite(v));

    const unicas = Array.from(new Set(ids)).sort((a, b) => a - b);

    return unicas.length > 0 ? unicas : [1, 2, 3];
  }, [reservas]);

  // Mapa reservas por (cancha|hora)
  const reservaPorCelda = useMemo(() => {
    const map = new Map();
    for (const r of reservas || []) {
      const estado = String(r.estado || "").toLowerCase().trim();
      if (estado === "cancelada") continue;

      const h = normalizarHora(r.hora);
      const key = `${r.id_cancha}|${h}`;
      // Si hay duplicados, dejamos el último (por seguridad)
      map.set(key, r);
    }
    return map;
  }, [reservas]);

  // Agrupar reservas por grupo_id para mostrar badge x2 (o más) sin mostrar el código
  const grupoInfo = useMemo(() => {
    // key: grupo_id -> { horas: [...], minHora, count }
    const groups = new Map();

    for (const r of reservas || []) {
      const estado = String(r.estado || "").toLowerCase().trim();
      if (estado === "cancelada") continue;

      const gid = r.grupo_id ? String(r.grupo_id) : null;
      if (!gid) continue;

      const h = normalizarHora(r.hora);
      if (!groups.has(gid)) groups.set(gid, []);
      groups.get(gid).push(h);
    }

    const info = new Map();
    for (const [gid, horas] of groups.entries()) {
      const ordenadas = Array.from(new Set(horas)).sort(
        (a, b) => horaToMin(a) - horaToMin(b)
      );
      info.set(gid, {
        horas: ordenadas,
        minHora: ordenadas[0],
        count: ordenadas.length,
      });
    }
    return info;
  }, [reservas]);

  const diasIncluye = (diasStr, diaISO) => {
    if (!diasStr || !diaISO) return false;
    const parts = String(diasStr)
      .split(",")
      .map((x) => Number(String(x).trim()))
      .filter((n) => Number.isFinite(n));
    return parts.includes(Number(diaISO));
  };

  const bloqueosFijosActivos = useMemo(() => {
    return (bloqueosFijos || []).filter((b) => Number(b.activo ?? 1) === 1);
  }, [bloqueosFijos]);

  const fijoParaCelda = (idCancha, hhmm) => {
    if (!weekdayISO) return null;

    const t = horaToMin(hhmm);

    for (const b of bloqueosFijosActivos) {
      // id_cancha null -> aplica a todas
      const aplicaCancha = b.id_cancha == null || Number(b.id_cancha) === Number(idCancha);
      if (!aplicaCancha) continue;

      if (!diasIncluye(b.dias_semana, weekdayISO)) continue;

      const d = horaToMin(normalizarHora(b.hora_desde));
      const h = horaToMin(normalizarHora(b.hora_hasta));

      // rango [desde, hasta)
      if (t >= d && t < h) return b;
    }
    return null;
  };

  const badgeClasePorEstado = (estado) => {
    const e = String(estado || "").toLowerCase().trim();
    if (e === "confirmada") return "bg-emerald-500/15 text-emerald-300 border-emerald-500/25";
    if (e === "pendiente") return "bg-amber-500/15 text-amber-300 border-amber-500/25";
    return "bg-slate-500/15 text-slate-200 border-slate-500/25";
  };

  return (
    <div className="space-y-3">
      {/* Encabezado + leyenda */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h3 className="text-sm font-semibold text-slate-100">Calendario</h3>
          <p className="text-[11px] text-slate-400">
            {fechaAdmin ? `Fecha: ${fechaAdmin}` : "Seleccioná una fecha"}
          </p>
        </div>

        <div className="flex flex-wrap gap-2 text-[11px]">
          <span className="px-2 py-1 rounded-full border bg-emerald-500/10 border-emerald-500/20 text-emerald-200">
            Confirmada
          </span>
          <span className="px-2 py-1 rounded-full border bg-amber-500/10 border-amber-500/20 text-amber-200">
            Pendiente
          </span>
          <span className="px-2 py-1 rounded-full border bg-indigo-500/10 border-indigo-500/20 text-indigo-200">
            Fijo
          </span>
          <span className="px-2 py-1 rounded-full border bg-slate-800 border-slate-700 text-slate-200">
            Libre
          </span>
        </div>
      </div>

      {/* Tabla scrollable */}
      <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900">
        <table className="min-w-[680px] w-full border-collapse">
          <thead className="sticky top-0 z-10">
            <tr className="bg-slate-950">
              <th className="text-left text-[11px] font-semibold text-slate-200 px-3 py-3 border-b border-slate-800">
                Hora
              </th>
              {canchas.map((c) => (
                <th
                  key={c}
                  className="text-left text-[11px] font-semibold text-slate-200 px-3 py-3 border-b border-slate-800"
                >
                  Cancha {c}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {slots.map((hhmm) => (
              <tr key={hhmm} className="odd:bg-slate-950/30">
                {/* Hora */}
                <td className="px-3 py-3 border-b border-slate-800 align-top">
                  <div className="text-xs font-semibold text-slate-200">{hhmm}</div>
                </td>

                {/* Celdas por cancha */}
                {canchas.map((c) => {
                  const key = `${c}|${hhmm}`;
                  const r = reservaPorCelda.get(key);
                  const fijo = !r ? fijoParaCelda(c, hhmm) : null;

                  // Si es grupo, mostrar badge xN solo en el inicio del grupo
                  let badgeGrupo = null;
                  if (r?.grupo_id) {
                    const gi = grupoInfo.get(String(r.grupo_id));
                    if (gi && gi.count > 1 && gi.minHora === hhmm) {
                      badgeGrupo = `x${gi.count}`;
                    }
                  }

                  // Render celda
                  if (r) {
                    const nombre = r.nombre_cliente || "Sin nombre";
                    const estado = r.estado || "reservado";

                    return (
                      <td key={key} className="px-3 py-3 border-b border-slate-800 align-top">
                        <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-2.5 space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span
                              className={`text-[10px] px-2 py-0.5 rounded-full border font-semibold ${badgeClasePorEstado(
                                estado
                              )}`}
                            >
                              {String(estado).toLowerCase().trim() === "confirmada"
                                ? "Confirmada"
                                : String(estado).toLowerCase().trim() === "pendiente"
                                ? "Pendiente"
                                : "Reservada"}
                            </span>

                            {badgeGrupo && (
                              <span className="text-[10px] px-2 py-0.5 rounded-full border font-semibold bg-slate-800 text-slate-200 border-slate-700">
                                {badgeGrupo}
                              </span>
                            )}
                          </div>

                          <div className="text-xs font-semibold text-slate-100 leading-snug">
                            {nombre}
                          </div>

                          {r.telefono_cliente && (
                            <div className="text-[11px] text-slate-400">
                              {r.telefono_cliente}
                            </div>
                          )}
                        </div>
                      </td>
                    );
                  }

                  if (fijo) {
                    return (
                      <td key={key} className="px-3 py-3 border-b border-slate-800 align-top">
                        <div className="rounded-xl border border-indigo-500/25 bg-indigo-500/10 p-2.5">
                          <div className="text-[10px] font-semibold text-indigo-200 uppercase tracking-wide">
                            Fijo
                          </div>
                          <div className="text-xs font-semibold text-slate-100 mt-0.5">
                            {fijo.nombre || "Bloqueo fijo"}
                          </div>
                          {fijo.motivo && (
                            <div className="text-[11px] text-slate-300/80 mt-0.5 italic">
                              “{fijo.motivo}”
                            </div>
                          )}
                        </div>
                      </td>
                    );
                  }

                  // Libre
                  return (
                    <td key={key} className="px-3 py-3 border-b border-slate-800 align-top">
                      <div className="rounded-xl border border-slate-800 bg-slate-950/30 p-2.5">
                        <div className="text-[11px] text-slate-400">Libre</div>
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-[11px] text-slate-500">
        Tip: en móvil podés deslizar horizontalmente para ver todas las canchas.
      </p>
    </div>
  );
}

