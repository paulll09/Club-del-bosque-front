import React from "react";

/**
 * Loader animado con forma de paleta de pádel.
 * Props:
 * - size: tamaño en px (default 24)
 * - color: clase de color Tailwind (default "text-emerald-400")
 */
export default function Loader({ size = 24, className = "text-emerald-400" }) {
  return (
    <div 
      className={`animate-spin flex items-center justify-center ${className}`} 
      style={{ width: size, height: size }}
      role="status"
      aria-label="Cargando..."
    >
      <svg 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        className="w-full h-full"
      >
        {/* Mango de la paleta */}
        <line x1="12" y1="18" x2="12" y2="22" />
        {/* Cabeza de la paleta */}
        <path d="M12 2C8 2 5 5 5 9c0 4.5 3 7 7 9 4-2 7-4.5 7-9 0-4-3-7-7-7z" />
        {/* Agujeros de la paleta (detalles) */}
        <circle cx="12" cy="7" r="0.5" fill="currentColor" stroke="none" />
        <circle cx="10" cy="9" r="0.5" fill="currentColor" stroke="none" />
        <circle cx="14" cy="9" r="0.5" fill="currentColor" stroke="none" />
        <circle cx="12" cy="11" r="0.5" fill="currentColor" stroke="none" />
      </svg>
    </div>
  );
}