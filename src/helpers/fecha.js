// src/helpers/fecha.js

/**
 * Devuelve la fecha de hoy en formato "YYYY-MM-DD"
 * usando la hora local del navegador.
 */
export const getFechaHoy = () => {
  const h = new Date();
  const year = h.getFullYear();
  const month = String(h.getMonth() + 1).padStart(2, "0");
  const day = String(h.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

/**
 * Devuelve una fecha legible en español a partir de "YYYY-MM-DD".
 * Ej: "jueves 5 de diciembre".
 */
export const formatearFechaLarga = (fecha) => {
  if (!fecha) return "Seleccioná una fecha";

  const d = new Date(`${fecha}T00:00:00`);
  const opt = { weekday: "long", day: "numeric", month: "long" };
  const txt = d.toLocaleDateString("es-AR", opt);

  return txt.charAt(0).toUpperCase() + txt.slice(1);
};

/**
 * Indica si un horario "HH:MM" ya pasó respecto a la fecha dada.
 *
 * @param {string} fechaStr - Fecha "YYYY-MM-DD"
 * @param {string} horaStr  - Hora "HH:MM"
 * @returns {boolean}
 */
export const esHorarioPasado = (fechaStr, horaStr) => {
  if (!fechaStr) return false;

  const [Y, M, D] = fechaStr.split("-").map(Number);
  const [h, m] = horaStr.split(":").map(Number);

  const fechaHoraTurno = new Date(Y, M - 1, D, h, m);
  const ahora = new Date();

  return fechaHoraTurno < ahora;
};
