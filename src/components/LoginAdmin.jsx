import React, { useState } from "react";

/**
 * Formulario de login para administrador.
 *
 * Recibe:
 *  - apiUrl: URL base del backend
 *  - onLoginCorrecto: función que se llama cuando el login fue exitoso
 */
function LoginAdmin({ apiUrl, onLoginCorrecto }) {
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [cargando, setCargando] = useState(false);

  const manejarSubmit = async (e) => {
    e.preventDefault();

    if (!usuario.trim() || !password.trim()) {
      alert("Completá usuario y contraseña.");
      return;
    }

    try {
      setCargando(true);

      const respuesta = await fetch(`${apiUrl}/admin/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // incluye cookies de sesión
        credentials: "include",
        body: JSON.stringify({ usuario, password }),
      });

      const data = await respuesta.json();

      if (!respuesta.ok) {
        alert(data.mensaje || "Login incorrecto.");
        return;
      }

      alert("Login correcto.");
      onLoginCorrecto(); // avisamos al padre
    } catch (error) {
      console.error("Error en login admin:", error);
      alert("No se pudo iniciar sesión.");
    } finally {
      setCargando(false);
    }
  };

  return (
    <section className="bg-slate-900 rounded-2xl p-4 border border-slate-700">
      <h2 className="text-lg font-semibold mb-3 text-center">
        Ingreso administrador
      </h2>

      <form onSubmit={manejarSubmit} className="space-y-3">
        <div>
          <label className="block text-xs font-medium mb-1">Usuario</label>
          <input
            type="text"
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
            className="w-full rounded-xl bg-slate-800 border border-slate-700 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
            placeholder="admin"
          />
        </div>

        <div>
          <label className="block text-xs font-medium mb-1">
            Contraseña
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl bg-slate-800 border border-slate-700 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
            placeholder="••••••••"
          />
        </div>

        <button
          type="submit"
          disabled={cargando}
          className="w-full rounded-full py-2 text-xs font-semibold bg-emerald-500 text-slate-950 active:scale-[0.98] disabled:opacity-60"
        >
          {cargando ? "Ingresando..." : "Ingresar"}
        </button>
      </form>
    </section>
  );
}

export default LoginAdmin;
