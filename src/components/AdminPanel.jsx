import React, { useState, useEffect, useMemo } from "react";
import EncabezadoAdmin from "./admin/EncabezadoAdmin";
import BarraFechaAdmin from "./admin/BarraFechaAdmin";
import EstadisticasAdmin from "./admin/EstadisticasAdmin";
import FiltrosAdmin from "./admin/FiltrosAdmin";
import ListaReservasAdmin from "./admin/ListaReservasAdmin";
import CalendarioAdmin from "./admin/CalendarioAdmin";

/**
 * Panel administrativo.
 *
 * Responsabilidades:
 *  - Gestionar estado global del panel (fecha, reservas, config del club).
 *  - Cargar datos desde el backend (reservas y configuración).
 *  - Aplicar filtros y métricas.
 *  - Delegar el renderizado en subcomponentes de presentación.
 *
 * Props:
 * - apiUrl: URL base del backend
 * - adminToken: token de administrador
 * - onLogout: callback para cerrar sesión
 */
export default function AdminPanel({ apiUrl, adminToken, onLogout }) {
  const [fechaAdmin, setFechaAdmin] = useState(
    new Date().toISOString().slice(0, 10)
  );
  const [reservas, setReservas] = useState([]);
  const [cargando, setCargando] = useState(false);

  // Configuración del club (hora_apertura, hora_cierre, etc.)
  const [configClub, setConfigClub] = useState(null);

  // Filtros avanzados
  const [filtroEstado, setFiltroEstado] = useState("todas"); // todas | activas | confirmadas | canceladas
  const [filtroCancha, setFiltroCancha] = useState("todas"); // todas | 1 | 2 | 3 ...
  const [busqueda, setBusqueda] = useState(""); // nombre / teléfono

  // Vista: lista o calendario
  const [vista, setVista] = useState("lista"); // "lista" | "calendario"

  /**
   * Cargar configuración del club (para entender jornadas que cruzan medianoche).
   */
  useEffect(() => {
    const cargarConfig = async () => {
      try {
        const res = await fetch(`${apiUrl}/config`);
        if (!res.ok) return;
        const data = await res.json();
        setConfigClub(data);
      } catch (error) {
        console.warn("No se pudo cargar config del club:", error);
      }
    };

    cargarConfig();
  }, [apiUrl]);

  /**
   * Cargar reservas del backend para la fecha seleccionada.
   */
  const cargarReservas = async () => {
    if (!adminToken) {
      console.warn("No adminToken → No se puede cargar reservas.");
    }

    setCargando(true);

    try {
      const res = await fetch(`${apiUrl}/admin/reservas?fecha=${fechaAdmin}`, {
        headers: {
          "X-Admin-Token": adminToken,
        },
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        alert(data.mensaje || "No se pudieron cargar las reservas.");
        return;
      }

      const data = await res.json();
      setReservas(data || []);
    } catch (error) {
      console.error("Error al cargar reservas admin:", error);
      alert("Error de conexión.");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarReservas();
  }, [fechaAdmin, adminToken]);

  /**
   * Cancelar reserva (cambia estado a "cancelada").
   */
  const cancelarReserva = async (id) => {
    if (!window.confirm("¿Cancelar esta reserva?")) return;

    try {
      const res = await fetch(`${apiUrl}/reservas/cancelar/${id}`, {
        method: "POST",
        headers: {
          "X-Admin-Token": adminToken,
        },
      });

      if (res.ok) {
        setReservas((prev) =>
          prev.map((r) => (r.id === id ? { ...r, estado: "cancelada" } : r))
        );
      } else {
        alert("No se pudo cancelar la reserva.");
      }
    } catch (error) {
      alert("Error de conexión.");
    }
  };

  /**
   * Eliminar reserva de forma permanente.
   */
  const eliminarReserva = async (id) => {
    if (
      !window.confirm(
        "¿Borrar permanentemente? Esta acción no se puede deshacer."
      )
    )
      return;

    try {
      const res = await fetch(`${apiUrl}/reservas/${id}`, {
        method: "DELETE",
        headers: {
          "X-Admin-Token": adminToken,
        },
      });

      if (res.ok) {
        setReservas((prev) => prev.filter((r) => r.id !== id));
      } else {
        alert("No se pudo eliminar la reserva.");
      }
    } catch (error) {
      alert("Error de conexión.");
    }
  };

  /**
   * Métricas globales.
   */
  const estadisticas = useMemo(() => {
    const total = reservas.length;
    const canceladas = reservas.filter((r) => r.estado === "cancelada").length;
    const confirmadas = reservas.filter((r) => r.estado === "confirmada").length;
    const pendientes = reservas.filter((r) => r.estado === "pendiente").length;

    return {
      total,
      activas: total - canceladas,
      canceladas,
      confirmadas,
      pendientes,
    };
  }, [reservas]);

  /**
   * Aplicar filtros avanzados sobre la lista de reservas.
   */
  const reservasVisibles = reservas.filter((r) => {
    // Filtro por estado
    if (filtroEstado === "activas" && r.estado === "cancelada") return false;
    if (filtroEstado === "confirmadas" && r.estado !== "confirmada")
      return false;
    if (filtroEstado === "canceladas" && r.estado !== "cancelada") return false;

    // Filtro por cancha
    if (filtroCancha !== "todas" && String(r.id_cancha) !== filtroCancha) {
      return false;
    }

    // Búsqueda por nombre o teléfono
    if (busqueda.trim() !== "") {
      const texto = busqueda.toLowerCase();
      const nombre = (r.nombre_cliente || "").toLowerCase();
      const telefono = (r.telefono_cliente || "").toLowerCase();
      if (!nombre.includes(texto) && !telefono.includes(texto)) {
        return false;
      }
    }

    return true;
  });

  return (
    <div className="animate-fadeIn space-y-6 pb-16 w-full max-w-3xl mx-auto">
      <EncabezadoAdmin onLogout={onLogout} />

      <BarraFechaAdmin
        fechaAdmin={fechaAdmin}
        onFechaChange={setFechaAdmin}
        cargando={cargando}
        onRefrescar={cargarReservas}
      />

      <EstadisticasAdmin estadisticas={estadisticas} />

      <FiltrosAdmin
        filtroEstado={filtroEstado}
        setFiltroEstado={setFiltroEstado}
        filtroCancha={filtroCancha}
        setFiltroCancha={setFiltroCancha}
        busqueda={busqueda}
        setBusqueda={setBusqueda}
        vista={vista}
        setVista={setVista}
      />

      {vista === "lista" ? (
        <ListaReservasAdmin
          reservas={reservasVisibles}
          onCancelar={cancelarReserva}
          onEliminar={eliminarReserva}
        />
      ) : (
        <CalendarioAdmin
          reservas={reservasVisibles}
          fechaAdmin={fechaAdmin}
          configClub={configClub}
        />
      )}
    </div>
  );
}
