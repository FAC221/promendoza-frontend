import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import background from "../assets/background.jpeg"; // Imagen de fondo

const OptionSelector = () => {
  const navigate = useNavigate();
  const [showLoadOptions, setShowLoadOptions] = useState(false);

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${background})` }}
    >
      <div className="bg-white bg-opacity-80 p-8 rounded-lg shadow-lg min-h-[300px] w-full max-w-md">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">¿Cómo deseas continuar?</h1>

        {!showLoadOptions ? (
          <div className="space-y-4">
            <button
              onClick={() => setShowLoadOptions(true)}
              className="w-full px-6 py-3 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition-transform transform hover:scale-105"
            >
              Comenzar con la carga de un contacto
            </button>

            {/* 🔹 Redirigir a la lista de tarjetas pendientes */}
            <button
              onClick={() => navigate("/pending-cards")}
              className="w-full px-6 py-3 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600 transition-transform transform hover:scale-105"
            >
              Seleccionar una tarjeta pendiente
            </button>

            <button
              onClick={() => navigate("/general-data")}
              className="w-full px-6 py-3 bg-yellow-500 text-white rounded-lg shadow-md hover:bg-yellow-600 transition-transform transform hover:scale-105"
            >
              Seguir cargando datos
            </button>

            {/* 🔹 BOTÓN PARA IR AL DASHBOARD */}
            <button
            onClick={() => navigate("/dashboard")}
            className="w-full px-6 py-3 bg-purple-500 text-white rounded-lg shadow-md hover:bg-purple-600 transition-transform transform hover:scale-105"
>
            Ver Listado de Tarjetas
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">Selecciona el tipo de carga</h2>

            <button
              onClick={() => navigate("/manual")}
              className="w-full px-6 py-3 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition-transform transform hover:scale-105"
            >
              Carga Manual
            </button>

            <button
              onClick={() => navigate("/upload-card")}
              className="w-full px-6 py-3 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600 transition-transform transform hover:scale-105"
            >
              Carga Automática
            </button>

            <button
              onClick={() => setShowLoadOptions(false)}
              className="w-full px-6 py-3 bg-gray-400 text-white rounded-lg shadow-md hover:bg-gray-500 transition-transform transform hover:scale-105"
            >
              Volver
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default OptionSelector;
