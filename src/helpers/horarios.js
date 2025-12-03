// src/helpers/horarios.js

/**
 * Genera la lista de horarios a partir de:
 * - hora de apertura
 * - hora de cierre (puede ser del día siguiente, ej: 13:00 → 02:00)
 * - duración del turno en minutos
 *
 * Devuelve un array de strings "HH:MM".
 */
export function generarHorariosDesdeConfig(horaApertura, horaCierre, duracionMinutos) {
  if (!horaApertura || !horaCierre || !duracionMinutos) return [];

  const [hA, mA] = horaApertura.split(":").map(Number);
  const [hC, mC] = horaCierre.split(":").map(Number);

  let inicio = hA * 60 + mA;
  let fin = hC * 60 + mC;

  // Si el cierre es menor o igual que la apertura, asumimos que cierra al día siguiente
  // (por ejemplo: 13:00 → 02:00)
  if (fin <= inicio) {
    fin += 24 * 60;
  }

  const slots = [];

  for (let t = inicio; t < fin; t += duracionMinutos) {
    const hora = Math.floor(t / 60) % 24;
    const min = t % 60;

    const hh = String(hora).padStart(2, "0");
    const mm = String(min).padStart(2, "0");

    slots.push(`${hh}:${mm}`);
  }

  return slots;
}
