import React from "react";
import { useNavigate } from "react-router-dom";

const OptionsAfterSave = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-md shadow-md w-full max-w-md">
        <h2 className="text-xl font-bold text-gray-800 mb-6 text-center">
          ¿Qué quieres hacer ahora?
        </h2>
        <div className="flex flex-col space-y-4">
          <button
            onClick={() => navigate("/options")}
            className="bg-blue-500 text-white py-3 px-4 rounded-md hover:bg-blue-600 transition font-medium shadow-sm"
          >
            Volver a cargar un contacto
          </button>
          <button
            onClick={() => navigate("/a")}
            className="bg-green-500 text-white py-3 px-4 rounded-md hover:bg-green-600 transition font-medium shadow-sm"
          >
            Continuar con el ingreso del tipo de empresa
          </button>
          <button
            onClick={() => navigate("/")}
            className="bg-gray-300 text-gray-800 py-3 px-4 rounded-md hover:bg-gray-400 transition font-medium shadow-sm"
          >
            Ir al inicio
          </button>
        </div>
      </div>
    </div>
  );
};

export default OptionsAfterSave;
