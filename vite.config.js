import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

/**
 * Configuración de Vite:
 * - Usa React
 * - Multipágina:
 *    /       -> index.html
 *    /admin  -> admin.html
 */
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        // Página principal (clientes)
        main: resolve(__dirname, "index.html"),
        // Página del administrador
        admin: resolve(__dirname, "admin.html"),
      },
    },
  },
});
