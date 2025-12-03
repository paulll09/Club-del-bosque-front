// src/services/apiConfig.js
import { API_URL } from "../config";

/**
 * Obtiene la configuración pública del club desde el backend.
 * Endpoint: GET /config
 *
 * @param {string} [apiUrl=API_URL] - URL base del backend
 * @returns {Promise<object>} config
 */
export async function obtenerConfigPublica(apiUrl = API_URL) {
  const res = await fetch(`${apiUrl}/config`);

  if (!res.ok) {
    throw new Error("No se pudo cargar la configuración pública");
  }

  const data = await res.json();
  return data;
}
