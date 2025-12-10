// src/hooks/useReservasCliente.js
import { useCallback, useEffect, useState } from "react";
import { obtenerReservasYBloqueos } from "../services/apiReservas";
import {
  getFechaHoy,
  esHorarioPasado as esHorarioPasadoHelper,
} from "../helpers/fecha";

/**
 * Hook: useReservasCliente
 *
 * - Carga reservas y bloqueos para la fecha y cancha seleccionadas.
 * - Expone:
 *    - reservas, bloqueos
 *    - cargandoReservas
 *    - recargarReservas()
 *    - estaReservado(hora)
 *    - esHorarioPasado(hora)
 *    - esBloqueado(hora)
 *
 * Se asume que el backend devuelve:
 *  reservas: [
 *    { hora: 'HH:MM:SS', estado: 'pendiente|confirmada|cancelada', ... }
 *  ]
 *  bloqueos: [
 *    { tipo, hora_desde, hora_hasta, ... } o bloqueos de día completo
 *  ]
 */
export function useReservasCliente(apiUrl, fechaSeleccionada, canchaSeleccionada) {
  const [reservas, setReservas] = useState([]);
  const [bloqueos, setBloqueos] = useState([]);
  const [cargandoReservas, setCargandoReservas] = useState(false);

  /**
   * Carga reservas y bloqueos desde el backend.
   */
  const recargarReservas = useCallback(
    async (opts = {}) => {
      const { fecha: fechaOverride, idCancha: canchaOverride } = opts;

      const fecha = fechaOverride || fechaSeleccionada || getFechaHoy();
      const idCancha = canchaOverride || canchaSeleccionada;

      if (!fecha || !idCancha) {
        setReservas([]);
        setBloqueos([]);
        return;
      }

      setCargandoReservas(true);

      try {
        const { reservas: r, bloqueos: b } = await obtenerReservasYBloqueos({
          fecha,
          idCancha,
          apiUrl,
        });

        setReservas(Array.isArray(r) ? r : []);
        setBloqueos(Array.isArray(b) ? b : []);

        // Útil para debug si querés ver qué trae el back:
        // console.log("Reservas recibidas:", r);
        // console.log("Bloqueos recibidos:", b);
      } catch (error) {
        console.error("Error cargando reservas/bloqueos:", error);
        setReservas([]);
        setBloqueos([]);
      } finally {
        setCargandoReservas(false);
      }
    },
    [apiUrl, fechaSeleccionada, canchaSeleccionada]
  );

  /**
   * Carga inicial y recarga cuando cambia fecha/cancha.
   */
  useEffect(() => {
    recargarReservas();
  }, [recargarReservas]);

  /**
   * Indica si un horario está reservado.
   *
   * Regla actual:
   *  - SOLO se considera reservado si el estado es 'confirmada'.
   *  - Así, una vez que el pago se aprueba y el back cambia a confirmada,
   *    ese horario queda bloqueado para todos los usuarios.
   */
  const estaReservado = (horaSeleccionada) => {
    if (!horaSeleccionada) return false;

    const horaNorm = String(horaSeleccionada).slice(0, 5); // 'HH:MM'

    return reservas.some((r) => {
      if (!r || !r.hora) return false;

      const horaReserva = String(r.hora).slice(0, 5);
      if (horaReserva !== horaNorm) return false;

      const estado = (r.estado || "").toLowerCase();
      return estado === "confirmada";
    });
  };

  /**
   * Wrapper que delega en el helper global de fechas.
   */
  const esHorarioPasado = (hora) => {
    if (!fechaSeleccionada || !hora) return false;
    return esHorarioPasadoHelper(fechaSeleccionada, hora);
  };

  /**
   * Indica si un horario está bloqueado por configuración.
   *
   * Soporta:
   *  - bloqueos de día completo (tipo 'dia_completo' o campo dia_completo = 1)
   *  - bloqueos por rango [hora_desde, hora_hasta]
   */
  const esBloqueado = (hora) => {
    if (!hora) return false;
    if (!Array.isArray(bloqueos) || bloqueos.length === 0) return false;

    const [hStr, mStr] = String(hora).slice(0, 5).split(":");
    const minutosHora = parseInt(hStr, 10) * 60 + parseInt(mStr, 10);

    return bloqueos.some((b) => {
      if (!b) return false;

      const tipo = (b.tipo || "").toLowerCase();
      const diaCompletoFlag =
        b.dia_completo === 1 ||
        b.dia_completo === "1" ||
        tipo === "dia_completo" ||
        tipo === "completo";

      // Bloqueo de día completo
      if (diaCompletoFlag) {
        return true;
      }

      const desdeRaw =
        b.hora_desde ||
        b.desde_hora ||
        b.desde ||
        b.tramo_desde ||
        null;
      const hastaRaw =
        b.hora_hasta ||
        b.hasta_hora ||
        b.hasta ||
        b.tramo_hasta ||
        null;

      if (!desdeRaw || !hastaRaw) return false;

      const [hd, md] = String(desdeRaw).slice(0, 5).split(":");
      const [hh, mh] = String(hastaRaw).slice(0, 5).split(":");

      const desdeMin = parseInt(hd, 10) * 60 + parseInt(md, 10);
      const hastaMin = parseInt(hh, 10) * 60 + parseInt(mh, 10);

      return minutosHora >= desdeMin && minutosHora <= hastaMin;
    });
  };

  return {
    reservas,
    bloqueos,
    cargandoReservas,
    recargarReservas,
    estaReservado,
    esHorarioPasado,
    esBloqueado,
  };
}
