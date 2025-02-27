import React from "react";
import { Outlet, useNavigate } from "react-router-dom";

const AppLayout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear(); // Limpiar sesión
    navigate("/"); // Redirigir a la página de login
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Botón de Cerrar Sesión */}
      <button
        onClick={handleLogout}
        className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition shadow-md fixed top-4 right-4"
      >
        Cerrar Sesión
      </button>

      {/* Renderiza las páginas dentro del layout */}
      <div className="flex-grow">
        <Outlet />
      </div>
    </div>
  );
};

export default AppLayout; // ✅ Asegurar que se exporta como default
