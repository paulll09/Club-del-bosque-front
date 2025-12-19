import React, { useMemo } from "react";

// Helpers chiquitos
const pad2 = (n) => String(n).padStart(2, "0");

const normalizarHora = (h) => {
  if (!h) return "";
  // admite "19:00" o "19:00:00"
  if (h.length === 5) return `${h}:00`;
  return h.slice(0, 8);
};

const horaLabel = (hhmmss) => {
  const [hh, mm] = hhmmss.split(":");
  return `${hh}:${mm}`;
};

const parseHHMM = (hhmm) => {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
};

const generarHoras = (horaApertura = "14:00", horaCierre = "02:00") => {
  // devuelve lista de "HH:MM:SS" cada 60min, soporta cruce de medianoche
  let start = parseHHMM(horaApertura);
  let end = parseHHMM(horaCierre);

  // si cierre es menor/equal, significa que cierra al día siguiente
  if (end <= start) end += 24 * 60;

  const out = [];
  for (let t = start; t < end; t += 60) {
    const hh = Math.floor((t / 60) % 24);
    const mm = t % 60;
    out.push(`${pad2(hh)}:${pad2(mm)}:00`);
  }
  return out;
};

const diaSemana1a7 = (fechaYYYYMMDD) => {
  // JS: 0 domingo..6 sábado → queremos 1 lunes..7 domingo
  const d = new Date(`${fechaYYYYMMDD}T00:00:00`);
  const js = d.getDay(); // 0..6
  return js === 0 ? 7 : js; // domingo -> 7, lunes -> 1, ...
};

const estaDentroRango = (hora, desde, hasta) => {
  // hora, desde, hasta: "HH:MM:SS" o "HH:MM"
  const h = parseHHMM(horaLabel(normalizarHora(hora)));
  const d = parseHHMM(horaLabel(normalizarHora(desde)));
  const a = parseHHMM(horaLabel(normalizarHora(hasta)));
  // rango [desde, hasta) por horas
  return h >= d && h < a;
};

export default function CalendarioAdmin({
  reservas = [],
  bloqueosFijos = [],
  fechaAdmin,
  configClub,
}) {
  const horas = useMemo(() => {
    const apertura = configClub?.hora_apertura || "14:00";
    const cierre = configClub?.hora_cierre || "02:00";
    return generarHoras(apertura, cierre);
  }, [configClub]);

  const dow = useMemo(() => (fechaAdmin ? diaSemana1a7(fechaAdmin) : 1), [fechaAdmin]);

  // Index reservas: cancha|hora -> reserva
  const reservasIndex = useMemo(() => {
    const map = new Map();
    for (const r of reservas || []) {
      const hora = normalizarHora(r.hora);
      const key = `${r.id_cancha}|${hora}`;
      map.set(key, r);
    }
    return map;
  }, [reservas]);

  // Index bloqueos fijos: cancha|hora -> {nombre, motivo}
  const fijosIndex = useMemo(() => {
    const map = new Map();
    for (const b of bloqueosFijos || []) {
      if (b.activo === 0 || b.activo === "0") continue;

      const dias = String(b.dias_semana || "")
        .split(",")
        .map((x) => parseInt(x.trim(), 10))
        .filter(Boolean);

      if (!dias.includes(dow)) continue;

      const hDesde = normalizarHora(b.hora_desde);
      const hHasta = normalizarHora(b.hora_hasta);

      // aplica a una cancha o a todas
      const canchas = b.id_cancha ? [Number(b.id_cancha)] : [1, 2, 3];

      for (const idCancha of canchas) {
        for (const h of horas) {
          if (estaDentroRango(h, hDesde, hHasta)) {
            const key = `${idCancha}|${h}`;
            map.set(key, b);
          }
        }
      }
    }
    return map;
  }, [bloqueosFijos, horas, dow]);

  const canchas = [1, 2, 3];

  const estadoBadge = (estado) => {
    const e = String(estado || "").toLowerCase();
    if (e === "confirmada") return "bg-emerald-500/15 text-emerald-200 border-emerald-500/25";
    if (e === "pendiente") return "bg-amber-500/15 text-amber-200 border-amber-500/25";
    if (e === "cancelada") return "bg-slate-500/10 text-slate-300 border-slate-500/20";
    return "bg-indigo-500/10 text-indigo-200 border-indigo-500/20";
  };

  const tarjeta = (contenido, variant = "libre") => {
    if (variant === "ocupado") {
      return "bg-slate-900 border-slate-700/70 hover:border-slate-600";
    }
    if (variant === "fijo") {
      return "bg-indigo-950/40 border-indigo-500/25 hover:border-indigo-400/30";
    }
    return "bg-slate-950/40 border-slate-800 hover:border-slate-700";
  };

  return (
    <div className="space-y-4">
      <div className="flex items-end justify-between">
        <div>
          <h3 className="text-lg font-extrabold text-white">Calendario</h3>
          <p className="text-xs text-slate-400">
            {fechaAdmin ? `Fecha: ${fechaAdmin}` : "Elegí una fecha"} · Mostrando reservas + bloqueos fijos
          </p>
        </div>

        <div className="hidden sm:flex gap-2 text-[11px]">
          <span className="px-2 py-1 rounded-full border bg-emerald-500/10 text-emerald-200 border-emerald-500/20">
            Confirmada
          </span>
          <span className="px-2 py-1 rounded-full border bg-amber-500/10 text-amber-200 border-amber-500/20">
            Pendiente
          </span>
          <span className="px-2 py-1 rounded-full border bg-indigo-500/10 text-indigo-200 border-indigo-500/20">
            Fijo
          </span>
          <span className="px-2 py-1 rounded-full border bg-slate-500/10 text-slate-200 border-slate-500/20">
            Libre
          </span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[780px]">
          {/* Header */}
          <div className="grid grid-cols-[120px_repeat(3,1fr)] gap-2 sticky top-0 z-10">
            <div className="rounded-xl border border-slate-800 bg-slate-950/80 px-3 py-2">
              <p className="text-[11px] font-bold text-slate-300 uppercase tracking-widest">Hora</p>
            </div>
            {canchas.map((c) => (
              <div
                key={c}
                className="rounded-xl border border-slate-800 bg-slate-950/80 px-3 py-2"
              >
                <p className="text-[11px] font-bold text-slate-200">
                  Cancha {c}
                </p>
                <p className="text-[10px] text-slate-500">Disponibilidad del día</p>
              </div>
            ))}
          </div>

          {/* Body */}
          <div className="mt-2 grid gap-2">
            {horas.map((h) => (
              <div key={h} className="grid grid-cols-[120px_repeat(3,1fr)] gap-2">
                {/* Hora */}
                <div className="rounded-xl border border-slate-800 bg-slate-950/40 px-3 py-3 flex items-center">
                  <span className="text-sm font-extrabold text-white">
                    {horaLabel(h)}
                  </span>
                </div>

                {/* Canchas */}
                {canchas.map((idCancha) => {
                  const key = `${idCancha}|${h}`;
                  const r = reservasIndex.get(key);

                  // si hay reserva (no cancelada) manda por encima del fijo
                  const estado = String(r?.estado || "").toLowerCase();
                  const estaOcupada = r && estado !== "cancelada";

                  if (estaOcupada) {
                    const nombre = r?.nombre_cliente || "Reservado";
                    return (
                      <div
                        key={idCancha}
                        className={`rounded-xl border px-3 py-3 transition-colors ${tarjeta("", "ocupado")}`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-sm font-bold text-white truncate">{nombre}</p>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full border ${estadoBadge(r.estado)}`}>
                            {String(r.estado || "reservado").toUpperCase()}
                          </span>
                        </div>

                        <p className="text-[11px] text-slate-400 mt-1">
                          {r?.telefono_cliente ? `Tel: ${r.telefono_cliente}` : "—"}
                        </p>

                        {/* sin mostrar grupo_id (queda feo) */}
                        <p className="text-[10px] text-slate-500 mt-1">
                          Turno reservado
                        </p>
                      </div>
                    );
                  }

                  // si no hay reserva, chequeamos fijo
                  const fijo = fijosIndex.get(key);
                  if (fijo) {
                    return (
                      <div
                        key={idCancha}
                        className={`rounded-xl border px-3 py-3 transition-colors ${tarjeta("", "fijo")}`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-sm font-bold text-indigo-100 truncate">
                            {fijo.nombre || "Horario fijo"}
                          </p>
                          <span className="text-[10px] px-2 py-0.5 rounded-full border bg-indigo-500/10 text-indigo-200 border-indigo-500/20">
                            FIJO
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-1">
                          {fijo.motivo ? fijo.motivo : "Bloqueo semanal"}
                        </p>
                      </div>
                    );
                  }

                  // libre
                  return (
                    <div
                      key={idCancha}
                      className={`rounded-xl border px-3 py-3 transition-colors ${tarjeta("", "libre")}`}
                    >
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-semibold text-slate-200">Libre</p>
                        <span className="text-[10px] px-2 py-0.5 rounded-full border bg-slate-500/10 text-slate-200 border-slate-500/20">
                          OK
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1">
                        Disponible para reservar
                      </p>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>

          <p className="text-[11px] text-slate-500 mt-3">
            Tip: si un bloqueo fijo coincide con una reserva, se mostrará la reserva (tiene prioridad).
          </p>
        </div>
      </div>
    </div>
  );
}

