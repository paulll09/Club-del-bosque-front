import React, { useState } from "react";
import AdminPanel from "./components/AdminPanel";
import LoginAdmin from "./components/LoginAdmin";
import { API_URL } from "./config"; // <--- Importamos la configuración

export default function Admin() {
  const [logueado, setLogueado] = useState(false);

  const manejarLogout = () => {
    setLogueado(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 flex justify-center">
      <div className="w-full max-w-xl px-4 py-6 space-y-4">
        {!logueado ? (
          <>
            <h1 className="text-2xl font-bold text-center mb-8 text-emerald-400">
              Portal Administrativo
            </h1>
            <LoginAdmin
              apiUrl={API_URL}
              onLoginCorrecto={() => setLogueado(true)}
            />
          </>
        ) : (
          <AdminPanel 
            apiUrl={API_URL} 
            onLogout={manejarLogout} 
          />
        )}
      </div>
    </div>
  );
}