// src/services/apiReservas.js
import { API_URL } from "../config";

/**
 * Obtiene reservas y bloqueos de disponibilidad para una fecha/cancha.
 * - GET /reservas?fecha=YYYY-MM-DD&id_cancha=n
 * - GET /bloqueos-disponibilidad?fecha=YYYY-MM-DD&id_cancha=n
 */
export async function obtenerReservasYBloqueos({
  fecha,
  idCancha,
  apiUrl = API_URL,
}) {
  const [resReservas, resBloqueos] = await Promise.all([
    fetch(`${apiUrl}/reservas?fecha=${fecha}&id_cancha=${idCancha}`),
    fetch(`${apiUrl}/bloqueos-disponibilidad?fecha=${fecha}&id_cancha=${idCancha}`),
  ]);

  const reservas = await resReservas.json().catch(() => []);
  const bloqueos = await resBloqueos.json().catch(() => []);

  return {
    reservas: Array.isArray(reservas) ? reservas : [],
    bloqueos: Array.isArray(bloqueos) ? bloqueos : [],
  };
}

/**
 * Crea una reserva y devuelve la respuesta del backend.
 * Endpoint: POST /reservas
 */
export async function crearReserva(reserva, apiUrl = API_URL) {
  const res = await fetch(`${apiUrl}/reservas`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(reserva),
  });

  const json = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(json.mensaje || "Error creando reserva");
  }

  return json; // puede incluir init_point
}

/**
 * Confirma el pago de una reserva.
 * Endpoint: POST /reservas/confirmar/{id}
 */
export async function confirmarPagoReserva(idReserva, apiUrl = API_URL) {
  const res = await fetch(`${apiUrl}/reservas/confirmar/${idReserva}`, {
    method: "POST",
  });

  if (!res.ok) {
    throw new Error("No se pudo confirmar el pago de la reserva");
  }

  return true;
}

/**
 * Elimina por completo una reserva.
 * Endpoint: DELETE /reservas/{id}
 */
export async function eliminarReserva(idReserva, apiUrl = API_URL) {
  const res = await fetch(`${apiUrl}/reservas/${idReserva}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    throw new Error("No se pudo eliminar la reserva");
  }

  return true;
}
