import React from "react";

export default function BottomNav({ seccionActiva, setSeccionActiva }) {
  const btnClass = (seccion) => 
    `flex flex-col items-center gap-1 transition group flex-1 ${seccionActiva === seccion ? 'text-emerald-400' : 'text-slate-500'}`;

  return (
    <div className="fixed bottom-0 left-0 w-full bg-slate-950/95 backdrop-blur-xl border-t border-slate-800 pb-safe pt-2 px-6 z-50 flex justify-between items-center h-16 sm:hidden shadow-[0_-5px_20px_rgba(0,0,0,0.5)]">
      
      <button onClick={() => setSeccionActiva("reservar")} className={btnClass("reservar")}>
        <div className={`p-1 rounded-full transition-all ${seccionActiva === "reservar" ? 'bg-emerald-500/10 scale-110' : ''}`}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </div>
        <span className="text-[9px] font-medium">Reservar</span>
      </button>

      <button onClick={() => setSeccionActiva("turnos")} className={btnClass("turnos")}>
        <div className={`p-1 rounded-full transition-all ${seccionActiva === "turnos" ? 'bg-emerald-500/10 scale-110' : ''}`}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </div>
        <span className="text-[9px] font-medium">Mis Turnos</span>
      </button>

      <button onClick={() => setSeccionActiva("perfil")} className={btnClass("perfil")}>
        <div className={`p-1 rounded-full transition-all ${seccionActiva === "perfil" ? 'bg-emerald-500/10 scale-110' : ''}`}>
             <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </div>
        <span className="text-[9px] font-medium">Perfil</span>
      </button>
    </div>
  );
}