import React from "react";

/**
 * ResumenReserva
 *
 * Componente de presentación que muestra un resumen compacto
 * de la selección actual del usuario:
 *  - fecha
 *  - cancha
 *  - hora
 *
 * No realiza ninguna lógica de negocio. Solo recibe props y las muestra.
 *
 * Props:
 *  - fechaSeleccionada: string con formato "YYYY-MM-DD" o cadena vacía
 *  - canchaSeleccionada: string o número identificando la cancha
 *  - horaSeleccionada: string con formato "HH:MM" o cadena vacía
 */
function ResumenReserva({
  fechaSeleccionada,
  canchaSeleccionada,
  horaSeleccionada,
}) {
  const tieneFecha = Boolean(fechaSeleccionada);
  const tieneHora = Boolean(horaSeleccionada);

  /**
   * Determina un mensaje de estado según los datos seleccionados.
   */
  const obtenerEstado = () => {
    if (!tieneFecha) {
      return "Seleccioná una fecha para comenzar.";
    }

    if (!tieneHora) {
      return "Elegí un horario para continuar con la reserva.";
    }

    return "Datos completos. Podés confirmar la reserva.";
  };

  /**
   * Determina el estilo de color del estado según el nivel de avance.
   */
  const obtenerClaseEstado = () => {
    if (!tieneFecha || !tieneHora) {
      return "text-amber-300";
    }

    return "text-emerald-300";
  };

  return (
    <section className="bg-slate-900/90 rounded-3xl p-4 border border-slate-800/70">
      <h2 className="text-sm font-semibold mb-2">Resumen de tu reserva</h2>

      <div className="flex flex-col gap-1 text-[11px]">
        <div className="flex justify-between">
          <span className="text-slate-400">Fecha</span>
          <span className="font-medium text-slate-100">
            {tieneFecha ? fechaSeleccionada : "Sin seleccionar"}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-slate-400">Cancha</span>
          <span className="font-medium text-slate-100">
            {canchaSeleccionada ? `Cancha ${canchaSeleccionada}` : "-"}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-slate-400">Horario</span>
          <span className="font-medium text-slate-100">
            {tieneHora ? `${horaSeleccionada} hs` : "Sin seleccionar"}
          </span>
        </div>
      </div>

      <p className={`mt-3 text-[11px] ${obtenerClaseEstado()}`}>
        {obtenerEstado()}
      </p>
    </section>
  );
}

export default ResumenReserva;
