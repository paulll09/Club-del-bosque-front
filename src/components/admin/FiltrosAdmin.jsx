import React from "react";

/**
 * Filtros avanzados + selector de vista (lista / calendario).
 *
 * Props:
 * - filtroEstado, setFiltroEstado
 * - filtroCancha, setFiltroCancha
 * - busqueda, setBusqueda
 * - vista, setVista
 */
export default function FiltrosAdmin({
  filtroEstado,
  setFiltroEstado,
  filtroCancha,
  setFiltroCancha,
  busqueda,
  setBusqueda,
  vista,
  setVista,
}) {
  return (
    <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Filtro estado */}
        <div>
          <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1">
            Estado
          </label>
          <select
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value)}
            className="w-full text-xs bg-slate-950 border border-slate-700 rounded-lg px-2 py-2 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          >
            <option value="todas">Todas</option>
            <option value="activas">Activas</option>
            <option value="confirmadas">Confirmadas</option>
            <option value="canceladas">Canceladas</option>
          </select>
        </div>

        {/* Filtro cancha */}
        <div>
          <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1">
            Cancha
          </label>
          <select
            value={filtroCancha}
            onChange={(e) => setFiltroCancha(e.target.value)}
            className="w-full text-xs bg-slate-950 border border-slate-700 rounded-lg px-2 py-2 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          >
            <option value="todas">Todas</option>
            <option value="1">Cancha 1</option>
            <option value="2">Cancha 2</option>
            <option value="3">Cancha 3</option>
          </select>
        </div>

        {/* Búsqueda */}
        <div>
          <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1">
            Buscar
          </label>
          <input
            type="text"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Nombre o teléfono"
            className="w-full text-xs bg-slate-950 border border-slate-700 rounded-lg px-2 py-2 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>
      </div>

      {/* Toggle vista Lista / Calendario */}
      <div className="flex justify-end">
        <div className="inline-flex bg-slate-950 border border-slate-800 rounded-2xl p-1 text-[11px]">
          <button
            type="button"
            onClick={() => setVista("lista")}
            className={`px-3 py-1.5 rounded-xl font-semibold transition-all ${
              vista === "lista"
                ? "bg-slate-800 text-white shadow-sm"
                : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/70"
            }`}
          >
            Lista
          </button>
          <button
            type="button"
            onClick={() => setVista("calendario")}
            className={`px-3 py-1.5 rounded-xl font-semibold transition-all ${
              vista === "calendario"
                ? "bg-slate-800 text-white shadow-sm"
                : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/70"
            }`}
          >
            Calendario
          </button>
        </div>
      </div>
    </div>
  );
}
