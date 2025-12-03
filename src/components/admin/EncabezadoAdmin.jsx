import React from "react";

/**
 * Encabezado superior del panel administrativo.
 *
 * Muestra el título del panel y el botón para cerrar sesión.
 *
 * Props:
 * - onLogout: función para cerrar sesión del administrador.
 */
export default function EncabezadoAdmin({ onLogout }) {
  return (
    <div className="flex justify-between items-center pb-2 border-b border-slate-800/50">
      <div>
        <h2 className="text-2xl font-bold text-white tracking-tight">
          Panel de Control
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Administración de turnos
        </p>
      </div>

      <button
        onClick={onLogout}
        className="bg-slate-800/50 hover:bg-red-500/10 text-slate-400 hover:text-red-400 p-2.5 rounded-xl transition-all border border-slate-700 hover:border-red-500/20"
        title="Cerrar Sesión"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path
            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  );
}
