import React, { useState, useEffect } from "react";
import { UserCircle2 } from "lucide-react";
import { API_URL } from "./config";

// Hooks y helpers
import { useConfigClub } from "./hooks/useConfigClub";
import { useReservasCliente } from "./hooks/useReservasCliente";
import { formatearFechaLarga, getFechaHoy } from "./helpers/fecha";
import { useUser } from "./context/UserContext";

// UI
import SelectorCancha from "./components/SelectorCancha";
import ListaHorarios from "./components/ListaHorarios";
import SelectorDiaCarrusel from "./components/SelectorDiaCarrusel";
import WeatherWidget from "./components/WeatherWidget";
import BottomNav from "./components/BottomNav";
import Toast from "./components/Toast";
import ModalConfirmacion from "./components/ModalConfirmacion";
import Loader from "./components/Loader";

// Usuario
import LoginCliente from "./components/LoginCliente";
import MisTurnos from "./components/MisTurnos";
import Perfil from "./components/Perfil";

/**
 * App principal – vista cliente
 */
export default function App() {
  const [fechaSeleccionada, setFechaSeleccionada] = useState(getFechaHoy());
  const [canchaSeleccionada, setCanchaSeleccionada] = useState(1);
  const [seccionActiva, setSeccionActiva] = useState("reservar");
  const [horaSeleccionada, setHoraSeleccionada] = useState(null);

  // Toast y modal de confirmación
  const [toast, setToast] = useState(null);
  const [confirmModal, setConfirmModal] = useState(null);

  // Usuario desde contexto
  const { usuario, login, logout, mostrarLogin, setMostrarLogin } = useUser();

  // Config del club
  const {
    config,
    horariosConfig,
    cargandoConfig,
    errorConfig,
  } = useConfigClub(API_URL);

  // Reservas y bloqueos
  const {
    reservas,
    bloqueos,
    cargandoReservas,
    recargarReservas,
    estaReservado,
    esBloqueado,
  } = useReservasCliente(API_URL, fechaSeleccionada, canchaSeleccionada);

  // Indica si la jornada cruza medianoche
  const cruzaMedianoche = (() => {
    if (!config?.hora_apertura || !config?.hora_cierre) return false;
    const [hA, mA] = config.hora_apertura.split(":").map(Number);
    const [hC, mC] = config.hora_cierre.split(":").map(Number);
    const inicio = hA * 60 + mA;
    const fin = hC * 60 + mC;
    return fin <= inicio;
  })();

  // Toast
  const mostrarToast = (message, type = "info") =>
    setToast({ message, type });
  const cerrarToast = () => setToast(null);

  // Manejo de retorno de Mercado Pago
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const estado = params.get("estado");
    const idReserva = params.get("id_reserva");

    if (estado === "exito" && idReserva) {
      confirmarPagoBackend(idReserva);
    } else if (estado === "failure") {
      mostrarToast(
        "El pago no se completó. Podés intentar nuevamente.",
        "warning"
      );
    } else if (estado === "pending") {
      mostrarToast(
        "El pago quedó pendiente. Revisá tu cuenta de Mercado Pago.",
        "info"
      );
    }
  }, []);

  // Confirmar pago en el backend
  const confirmarPagoBackend = async (idReserva) => {
    try {
      const res = await fetch(
        `${API_URL}/reservas/confirmar/${idReserva}`,
        {
          method: "POST",
        }
      );

      const data = await res.json();

      if (!res.ok) {
        console.error("Error al confirmar reserva:", data);
        mostrarToast(
          "Ocurrió un problema al confirmar la reserva.",
          "error"
        );
        return;
      }

      mostrarToast(
        "Pago exitoso. Tu turno quedó confirmado.",
        "success"
      );
      recargarReservas();
    } catch (error) {
      console.error("Error confirmando el pago:", error);
      mostrarToast(
        "No se pudo confirmar el pago. Revisá más tarde.",
        "error"
      );
    }
  };

  // Verificación si un horario está en el pasado
  const esHorarioPasado = (hora) => {
    if (!fechaSeleccionada) return false;

    const hoyStr = getFechaHoy();
    if (fechaSeleccionada !== hoyStr) {
      return false;
    }

    const ahora = new Date();
    const [hSel, mSel] = hora.split(":").map(Number);

    const fechaSeleccionadaDate = new Date(fechaSeleccionada);
    const fechaHorario = new Date(
      fechaSeleccionadaDate.getFullYear(),
      fechaSeleccionadaDate.getMonth(),
      fechaSeleccionadaDate.getDate(),
      hSel,
      mSel,
      0
    );

    if (
      hSel < 6 &&
      cruzaMedianoche &&
      config?.hora_apertura &&
      config?.hora_cierre
    ) {
      fechaHorario.setDate(fechaHorario.getDate() + 1);
    }

    return fechaHorario < ahora;
  };

  // Selección de horario
  const seleccionarHorario = (hora) => {
    if (!fechaSeleccionada)
      return mostrarToast("Seleccioná una fecha.", "warning");
    if (esHorarioPasado(hora))
      return mostrarToast("Ese horario ya pasó.", "warning");

    if (!usuario) {
      setHoraSeleccionada(hora);
      setMostrarLogin(true);
      return;
    }

    setConfirmModal({
      titulo: "Reservar y pagar",
      mensaje: `Vas a reservar la Cancha ${canchaSeleccionada} a las ${hora} hs.\nSe abrirá Mercado Pago para abonar la seña.`,
      onConfirm: () => {
        confirmarReserva(hora, usuario);
        setConfirmModal(null);
      },
    });
  };

  // Enviar reserva al backend y obtener init_point de Mercado Pago
  const confirmarReserva = async (hora, user) => {
    try {
      const body = {
        fecha: fechaSeleccionada,
        hora,
        id_cancha: canchaSeleccionada,
        id_usuario: user.id,
      };

      const res = await fetch(`${API_URL}/reservas`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        console.error("Error al reservar:", data);
        mostrarToast(
          data?.message || "No se pudo crear la reserva.",
          "error"
        );
        return;
      }

      if (data.init_point) {
        window.location.href = data.init_point;
      } else {
        mostrarToast(
          "Reserva generada, pero no se recibió enlace de pago.",
          "warning"
        );
      }
    } catch (error) {
      console.error("Error en la reserva:", error);
      mostrarToast(
        "Ocurrió un error al crear la reserva.",
        "error"
      );
    }
  };

  // Login exitoso
  const manejarLoginSuccess = (u) => {
    login(u);

    mostrarToast(`Bienvenido, ${u.nombre}.`, "success");

    if (horaSeleccionada) {
      setConfirmModal({
        titulo: "Completar reserva",
        mensaje: `¿Confirmamos el turno de las ${horaSeleccionada} y vamos al pago?`,
        onConfirm: () => {
          confirmarReserva(horaSeleccionada, u);
          setConfirmModal(null);
        },
      });
    }
  };

  // Render de cada sección
  const renderSeccion = () => {
    if (seccionActiva === "turnos") {
      return <MisTurnos usuario={usuario} apiUrl={API_URL} />;
    }

    if (seccionActiva === "perfil") {
      if (!usuario) {
        return (
          <div className="p-6 text-center text-slate-100">
            <h2 className="text-xl font-semibold mb-2">
              Mi Perfil
            </h2>
            <p className="text-sm text-slate-400 mb-4">
              Iniciá sesión para ver y administrar tus datos.
            </p>
            <button
              onClick={() => setMostrarLogin(true)}
              className="px-4 py-2 rounded-full bg-emerald-500 text-slate-950 font-semibold text-sm hover:bg-emerald-400 transition"
            >
              Iniciar Sesión
            </button>
          </div>
        );
      }
      return <Perfil usuario={usuario} onLogout={logout} />;
    }

    return (
      <div className="space-y-4 py-4">
        <section className="bg-slate-900/60 border border-slate-800 rounded-2xl px-4 py-3 shadow-md flex items-center justify-between gap-3">
          <div>
            <h1 className="text-base font-semibold text-slate-100">
              Reservá tu cancha
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Elegí fecha, cancha y horario. Pagá la seña con Mercado Pago.
            </p>

            {usuario ? (
              <div className="mt-1 flex items-center gap-2 text-sm text-emerald-300">
                <UserCircle2 size={18} className="text-emerald-300" />
                <span>Hola, {usuario.nombre}.</span>
              </div>
            ) : (
              <button
                onClick={() => setMostrarLogin(true)}
                className="text-xs bg-white/10 hover:bg-white/20 px-4 py-2 rounded-full border border-white/20 mt-3"
              >
                Iniciar Sesión / Registrarse
              </button>
            )}
          </div>

          <div className="hidden sm:block">
            <WeatherWidget />
          </div>
        </section>

        <section className="bg-slate-900/60 border border-slate-800 rounded-2xl px-4 py-3 shadow-md">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-sm font-semibold text-slate-100">
                Fecha
              </h2>
              <p className="text-[11px] text-slate-400">
                {formatearFechaLarga(fechaSeleccionada)}
              </p>
            </div>
          </div>

          <SelectorDiaCarrusel
            fechaSeleccionada={fechaSeleccionada}
            onChange={setFechaSeleccionada}
          />
        </section>

        <section className="bg-slate-900/60 border border-slate-800 rounded-2xl px-4 py-3 shadow-md">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-slate-100">
              Cancha
            </h2>
          </div>

          <SelectorCancha
            canchaSeleccionada={canchaSeleccionada}
            onChange={setCanchaSeleccionada}
          />
        </section>

        <section className="bg-slate-900/60 border border-slate-800 rounded-2xl px-4 py-3 shadow-md">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-slate-100">
              Horarios disponibles
            </h2>
          </div>

          {cargandoConfig || cargandoReservas ? (
            <div className="flex justify-center py-6">
              <Loader />
            </div>
          ) : errorConfig ? (
            <p className="text-sm text-red-400">
              No se pudo cargar la configuración del club.
            </p>
          ) : (
            <ListaHorarios
              horariosConfig={horariosConfig}
              reservas={reservas}
              bloqueos={bloqueos}
              seleccionarHorario={seleccionarHorario}
              estaReservado={estaReservado}
              esBloqueado={esBloqueado}
              esHorarioPasado={esHorarioPasado}
              cruzaMedianoche={cruzaMedianoche}
            />
          )}

          <p className="mt-3 text-[11px] text-slate-400">
            Los horarios en gris están ocupados o bloqueados. Los horarios
            disponibles se muestran resaltados.
          </p>
        </section>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 pb-16">
      <header className="border-b border-slate-800 bg-slate-950/90 backdrop-blur-sm">
        <div className="max-w-md mx-auto px-4 py-3 flex items-center justify-between">
          <span className="text-sm font-semibold tracking-tight">
            Club del Bosque
          </span>
          <div className="sm:hidden">
            <WeatherWidget />
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4">{renderSeccion()}</main>

      {toast && <Toast {...toast} onClose={cerrarToast} />}

      {confirmModal && (
        <ModalConfirmacion
          titulo={confirmModal.titulo}
          mensaje={confirmModal.mensaje}
          onConfirm={confirmModal.onConfirm}
          onCancel={() => setConfirmModal(null)}
        />
      )}

      {mostrarLogin && (
        <LoginCliente
          apiUrl={API_URL}
          onLoginSuccess={manejarLoginSuccess}
          onCancelar={() => setMostrarLogin(false)}
        />
      )}

      <BottomNav
        seccionActiva={seccionActiva}
        setSeccionActiva={setSeccionActiva}
      />
    </div>
  );
}
