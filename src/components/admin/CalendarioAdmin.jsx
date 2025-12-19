import React, { useEffect, useMemo, useState } from "react";

/**
 * Vista calendario del panel admin.
 *
 * Tabla:
 *  - Filas: horas
 *  - Columnas: canchas
 *  - Celdas: Reserva / Bloqueo fijo / Libre
 *
 * Props esperadas:
 * - apiUrl: string (ej: https://tu-backend.com)
 * - adminToken: string
 * - reservas: array (reservas de la fecha ya cargadas en el panel)
 * - fechaAdmin: string "YYYY-MM-DD"
 * - configClub: { hora_apertura: "HH:MM", hora_cierre: "HH:MM" }
 *
 * NOTA:
 * - Carga bloqueos fijos desde: GET /admin/bloqueos-fijos (con X-Admin-Token)
 */
export default function CalendarioAdmin({
  apiUrl,
  adminToken,
  reservas = [],
  fechaAdmin,
  configClub,
}) {
  const [bloqueosFijos, setBloqueosFijos] = useState([]);
  const [cargandoFijos, setCargandoFijos] = useState(false);

  const cargarBloqueosFijos = async () => {
    if (!adminToken) return;
    setCargandoFijos(true);

    try {
      const res = await fetch(`${apiUrl}/admin/bloqueos-fijos`, {
        headers: { "X-Admin-Token": adminToken },
      });

      const data = await res.json().catch(() => []);
      if (!res.ok) {
        console.error("Error cargando bloqueos fijos:", data);
        setBloqueosFijos([]);
        return;
      }

      setBloqueosFijos(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error("Error de conexión cargando bloqueos fijos:", e);
      setBloqueosFijos([]);
    } finally {
      setCargandoFijos(false);
    }
  };

  // ✅ Este es el useEffect que preguntabas
  useEffect(() => {
    if (!adminToken) return;
    cargarBloqueosFijos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [adminToken]);

  // -------------------------
  // Helpers
  // -------------------------
  const toMinutes = (hhmm) => {
    if (!hhmm) return 0;
    const [h, m] = String(hhmm).split(":").map((x) => parseInt(x, 10));
    return (h || 0) * 60 + (m || 0);
  };

  const toHHMM = (mins) => {
    const h = Math.floor(mins / 60) % 24;
    const m = mins % 60;
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
  };

  const normalizarHoraReserva = (h) => {
    if (!h) return "";
    // puede venir "18:00" o "18:00:00"
    return String(h).slice(0, 5);
  };

  // Lunes=1 ... Domingo=7
  const diaSemanaFecha = useMemo(() => {
    if (!fechaAdmin) return null;
    const d = new Date(`${fechaAdmin}T12:00:00`);
    const js = d.getDay(); // 0=Dom .. 6=Sáb
    return js === 0 ? 7 : js; // Dom->7
  }, [fechaAdmin]);

  const horas = useMemo(() => {
    const apertura = configClub?.hora_apertura || "00:00";
    const cierre = configClub?.hora_cierre || "23:00";

    let start = toMinutes(apertura);
    let end = toMinutes(cierre);

    // si cruza medianoche, el cierre es "día siguiente"
    if (end <= start) end += 24 * 60;

    const out = [];
    // generamos por horas (60 min). Si tu sistema usa 30 min, lo cambiamos a 30.
    for (let t = start; t < end; t += 60) {
      out.push(toHHMM(t));
    }
    return out;
  }, [configClub]);

  const canchas = useMemo(() => {
    // si querés hacerlo dinámico, podés pasar configClub.canchas, etc.
    return [1, 2, 3];
  }, []);

  // Indexar reservas por "cancha|hora"
  const reservasIndex = useMemo(() => {
    const map = new Map();
    (reservas || []).forEach((r) => {
      const key = `${r.id_cancha}|${normalizarHoraReserva(r.hora)}`;
      map.set(key, r);
    });
    return map;
  }, [reservas]);

  // Filtrar bloqueos fijos aplicables a la fecha (por día semana)
  const fijosAplicables = useMemo(() => {
    if (!diaSemanaFecha) return [];
    return (bloqueosFijos || []).filter((b) => {
      if (!b.activo || Number(b.activo) !== 1) return false;
      const dias = String(b.dias_semana || "")
        .split(",")
        .map((x) => parseInt(x, 10))
        .filter(Boolean);
      return dias.includes(diaSemanaFecha);
    });
  }, [bloqueosFijos, diaSemanaFecha]);

  // Buscar si un fijo bloquea esa cancha/hora
  const buscarFijo = (idCancha, horaHHMM) => {
    return fijosAplicables.find((b) => {
      const aplicaCancha =
        b.id_cancha === null ||
        b.id_cancha === undefined ||
        b.id_cancha === "" ||
        Number(b.id_cancha) === Number(idCancha);

      if (!aplicaCancha) return false;

      const desde = String(b.hora_desde || "").slice(0, 5);
      const hasta = String(b.hora_hasta || "").slice(0, 5);

      // Bloqueo fijo por rango: [desde, hasta)
      // ejemplo 19:00-22:00 bloquea 19,20,21
      return horaHHMM >= desde && horaHHMM < hasta;
    });
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-sm font-semibold text-slate-100">
            Calendario de reservas
          </h3>
          <p className="text-[11px] text-slate-400">
            {fechaAdmin ? `Fecha: ${fechaAdmin}` : "Seleccione una fecha"}
          </p>
        </div>

        <button
          onClick={cargarBloqueosFijos}
          className="text-[11px] px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
        >
          {cargandoFijos ? "Actualizando..." : "Actualizar fijos ↻"}
        </button>
      </div>

      <div className="overflow-auto">
        <table className="min-w-full text-xs border-separate border-spacing-0">
          <thead>
            <tr>
              <th className="sticky left-0 z-10 bg-slate-950 text-slate-200 border border-slate-800 px-3 py-2 text-left">
                Hora
              </th>
              {canchas.map((c) => (
                <th
                  key={c}
                  className="bg-slate-950 text-slate-200 border border-slate-800 px-3 py-2 text-left"
                >
                  Cancha {c}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {horas.map((h) => (
              <tr key={h}>
                <td className="sticky left-0 z-10 bg-slate-950 text-slate-200 border border-slate-800 px-3 py-2 font-semibold">
                  {h}
                </td>

                {canchas.map((c) => {
                  const key = `${c}|${h}`;
                  const r = reservasIndex.get(key);
                  const fijo = !r ? buscarFijo(c, h) : null;

                  // RESERVA
                  if (r) {
                    const estado = String(r.estado || "").toLowerCase();
                    const esConfirmada = estado === "confirmada";
                    return (
                      <td
                        key={key}
                        className={`border border-slate-800 px-3 py-2 align-top ${
                          esConfirmada
                            ? "bg-emerald-900/20"
                            : "bg-amber-900/15"
                        }`}
                      >
                        <div className="font-semibold text-slate-100">
                          {esConfirmada ? "Reservado" : "Pendiente"}
                        </div>
                        <div className="text-[11px] text-slate-300">
                          {r.nombre_cliente || "Sin nombre"}
                        </div>
                        {r.telefono_cliente ? (
                          <div className="text-[11px] text-slate-400">
                            {r.telefono_cliente}
                          </div>
                        ) : null}
                        {r.grupo_id ? (
                          <div className="text-[10px] text-slate-400 mt-1">
                            Grupo: {r.grupo_id}
                          </div>
                        ) : null}
                      </td>
                    );
                  }

                  // BLOQUEO FIJO
                  if (fijo) {
                    return (
                      <td
                        key={key}
                        className="border border-slate-800 px-3 py-2 align-top bg-indigo-900/15"
                      >
                        <div className="font-semibold text-indigo-200">
                          Ocupado (Fijo)
                        </div>
                        <div className="text-[11px] text-slate-200">
                          {fijo.nombre || "Horario fijo"}
                        </div>
                        {fijo.motivo ? (
                          <div className="text-[11px] text-slate-400 italic">
                            “{fijo.motivo}”
                          </div>
                        ) : null}
                      </td>
                    );
                  }

                  // LIBRE
                  return (
                    <td
                      key={key}
                      className="border border-slate-800 px-3 py-2 text-slate-400"
                    >
                      Libre
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-3 text-[11px] text-slate-500">
        * Los bloqueos fijos se aplican según el día de la semana de la fecha
        seleccionada.
      </div>
    </div>
  );
}
