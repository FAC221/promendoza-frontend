import React from "react";
import { useNavigate } from "react-router-dom";
import background from "../assets/background.jpeg"; // Ruta a la imagen de fondo

const OptionSelector = () => {
  const navigate = useNavigate();

  const handleManualLoad = () => {
    navigate("/manual"); // Ruta para iniciar el flujo manual
  };

  const handleAutomaticLoad = () => {
    navigate("/automatic"); // Ruta para iniciar el flujo automático
  };

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${background})` }} // Ruta de la imagen de fondo
    >
      <div className="bg-white bg-opacity-80 p-8 rounded-lg shadow-lg min-h-[300px] w-full max-w-md">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          ¿Qué tipo de carga deseas realizar?
        </h1>
        <div className="space-y-4">
          <button
            onClick={handleManualLoad}
            className="w-full px-6 py-3 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 transition"
          >
            Carga Manual
          </button>
          <button
            onClick={handleAutomaticLoad}
            className="w-full px-6 py-3 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75 transition"
          >
            Carga Automática
          </button>
        </div>
      </div>
    </div>
  );
};

export default OptionSelector;
