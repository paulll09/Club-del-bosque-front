// src/hooks/useConfigClub.js
import { useEffect, useState } from "react";
import { generarHorariosDesdeConfig } from "../helpers/horarios";
import { obtenerConfigPublica } from "../services/apiConfig";



/**
 * Hook: useConfigClub
 *
 * Responsabilidad:
 *  - Cargar la configuración pública del club desde /config.
 *  - Generar la lista de horarios dinámicos a partir de:
 *      hora_apertura, hora_cierre, duracion_turno_minutos.
 *
 * Devuelve:
 *  - config: objeto de configuración completo.
 *  - horariosConfig: array de horarios "HH:MM" generados.
 *  - cargandoConfig: boolean de carga.
 *  - errorConfig: error en caso de fallo.
 */
const HORARIOS_FALLBACK = [
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
  "19:00",
  "20:00",
  "21:00",
  "22:00",
  "23:00",
];

export function useConfigClub(apiUrl) {
  const [config, setConfig] = useState(null);
  const [horariosConfig, setHorariosConfig] = useState(HORARIOS_FALLBACK);
  const [cargandoConfig, setCargandoConfig] = useState(false);
  const [errorConfig, setErrorConfig] = useState(null);

  useEffect(() => {
    const cargar = async () => {
      setCargandoConfig(true);
      setErrorConfig(null);

      try {
        const data = await obtenerConfigPublica(apiUrl);
        setConfig(data);

        const horariosGenerados = generarHorariosDesdeConfig(
          data.hora_apertura,
          data.hora_cierre,
          data.duracion_turno_minutos || 60
        );

        if (horariosGenerados.length > 0) {
          setHorariosConfig(horariosGenerados);
        }
      } catch (error) {
        console.error("Error cargando configuración pública:", error);
        setErrorConfig(error);
      } finally {
        setCargandoConfig(false);
      }
    };

    cargar();
  }, [apiUrl]);

  return {
    config,
    horariosConfig,
    cargandoConfig,
    errorConfig,
  };
}
