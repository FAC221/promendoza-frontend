import React, { useState } from "react";

const CardUploader = ({ onDataExtracted }) => {
  const [frontCard, setFrontCard] = useState(null);
  const [backCard, setBackCard] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (e, side) => {
    const file = e.target.files[0];
    if (side === "front") setFrontCard(file);
    else setBackCard(file);
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!frontCard || !backCard) {
      alert("Debes cargar ambas imágenes (frente y dorso)");
      return;
    }

    const formData = new FormData();
    formData.append("front", frontCard);
    formData.append("back", backCard);

    setIsLoading(true);

    try {
      // Obtener el token del localStorage
      const token = localStorage.getItem('authToken');

      if (!token) {
        alert("No estás autorizado. Por favor, inicia sesión nuevamente.");
        return;
      }

      const response = await fetch("/promendoza/api/upload-card", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        // Agregamos las imágenes al resultado
        const dataWithImages = {
          ...result.data,
          front_image: URL.createObjectURL(frontCard),
          back_image: URL.createObjectURL(backCard)
        };
        onDataExtracted(dataWithImages);
      } else {
        throw new Error(result.message || 'Error al procesar las imágenes');
      }
    } catch (error) {
      console.error("Error:", error);
      alert(error.message || "Hubo un problema al procesar las imágenes");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md w-full max-w-md">
      <h2 className="text-xl font-bold mb-4">Carga de tarjeta</h2>
      <form onSubmit={handleUpload}>  {/* Cambiado handleSubmit por handleUpload */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-1">Tarjeta (Frente)</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleFileChange(e, "front")}
            className="w-full border border-gray-300 rounded-md px-3 py-2"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-1">Tarjeta (Dorso)</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleFileChange(e, "back")}
            className="w-full border border-gray-300 rounded-md px-3 py-2"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors"
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
              </svg>
              Procesando...
            </span>
          ) : (
            "Subir"
          )}
        </button>
      </form>
    </div>
  );
};

export default CardUploader;
