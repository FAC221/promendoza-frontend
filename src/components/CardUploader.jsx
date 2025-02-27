import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import background from "../assets/background.jpeg";

const CardUploader = () => {
  const navigate = useNavigate();
  const [frontCard, setFrontCard] = useState(null);
  const [backCard, setBackCard] = useState(null);
  const [frontPreview, setFrontPreview] = useState(null);
  const [backPreview, setBackPreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [extractedData, setExtractedData] = useState(null);

  const handleFileChange = (e, side) => {
    const file = e.target.files[0];
    if (!file) return;

    const previewURL = URL.createObjectURL(file);
    if (side === "front") {
      setFrontCard(file);
      setFrontPreview(previewURL);
    } else {
      setBackCard(file);
      setBackPreview(previewURL);
    }
  };

  // 🔹 Guardar la tarjeta en localStorage sin subir al backend
  const handleStoreTemporarily = () => {
    if (!frontCard || !backCard) {
      setErrorMessage("Debes cargar ambas imágenes antes de almacenar temporalmente.");
      return;
    }

    const tempCard = {
      id: Date.now(), // 🔹 ID único
      front_image: frontPreview,
      back_image: backPreview,
      isTemporary: true,
    };

    let storedCards = JSON.parse(localStorage.getItem("pendingCards")) || [];
    storedCards.push(tempCard);
    localStorage.setItem("pendingCards", JSON.stringify(storedCards));

    setSuccessMessage("Tarjeta almacenada temporalmente.");
  };

  // 🔹 Subir la tarjeta al backend y continuar con la carga
  const handleUpload = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");
    setSuccessMessage("");
  
    if (!frontCard || !backCard) {
      setErrorMessage("Debes cargar ambas imágenes (frente y dorso)");
      setIsLoading(false);
      return;
    }
  
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        setErrorMessage("No estás autorizado. Inicia sesión.");
        setIsLoading(false);
        return;
      }
  
      const bearerToken = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
      const formData = new FormData();
      
      formData.append("file", frontCard);
      formData.append("file", backCard);
  
      console.log("Subiendo imágenes...");
  
      const uploadResponse = await fetch("https://promendoza.equilybrio-dev.ar/promendoza/api/cards/upload", {
        method: "POST",
        headers: { 
          Authorization: bearerToken 
        },
        body: formData,
      });
  
      if (!uploadResponse.ok) {
        const errorData = await uploadResponse.json().catch(() => ({}));
        console.error("Error en la respuesta del servidor:", {
          status: uploadResponse.status,
          statusText: uploadResponse.statusText,
          errorData
        });
        throw new Error(errorData.message || "Error al subir la tarjeta");
      }
  
      const uploadData = await uploadResponse.json();
      console.log("Respuesta de subida:", uploadData);
  
      // Analizar la tarjeta usando los nombres de archivo devueltos
      const analyzeResponse = await fetch("https://promendoza.equilybrio-dev.ar/promendoza/api/cards/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: bearerToken,
        },
        body: JSON.stringify({ 
          files: uploadData.filenames 
        }),
      });
  
      if (!analyzeResponse.ok) {
        const errorData = await analyzeResponse.json().catch(() => ({}));
        console.error("Error en el análisis:", {
          status: analyzeResponse.status,
          errorData
        });
        throw new Error(errorData.message || "Error al analizar la tarjeta");
      }
  
      const analyzeData = await analyzeResponse.json();
      console.log("Datos analizados:", analyzeData);
  
      if (analyzeData.status === "success" && analyzeData.data) {
        // Crear objeto con los datos necesarios
        const cardData = {
          ...analyzeData.data,
          front_image: uploadData.filenames[0],
          back_image: uploadData.filenames[1]
        };
  
        // Guardar en localStorage y navegar al MainContainer
        localStorage.setItem("selectedCard", JSON.stringify(cardData));
        navigate("/automatic"); // Usar la ruta del flujo automático
      } else {
        throw new Error("No se pudieron extraer datos de la tarjeta");
      }
  
    } catch (error) {
      console.error("Error completo:", error);
      setErrorMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: `url(${background})` }}
    >
      <div className="w-full max-w-md p-6 bg-white bg-opacity-90 rounded-lg shadow-lg">
        <h2 className="text-xl font-bold text-center text-gray-900 mb-4">Carga de Tarjeta</h2>

        {extractedData ? (
          <SaveCardForm cardData={extractedData} onSave={() => setExtractedData(null)} />
        ) : (
          <form onSubmit={handleUpload} className="space-y-4">
            {/* 🔹 Input de imagen - Frente */}
            <div>
              <label className="block text-gray-700 mb-1">Tarjeta (Frente)</label>
              <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, "front")}
                className="w-full border border-gray-300 rounded-md px-3 py-2"/>
              {frontPreview && <img src={frontPreview} alt="Frente" className="w-full h-32 object-cover rounded-md mt-2 shadow" />}
            </div>

            {/* 🔹 Input de imagen - Dorso */}
            <div>
              <label className="block text-gray-700 mb-1">Tarjeta (Dorso)</label>
              <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, "back")}
                className="w-full border border-gray-300 rounded-md px-3 py-2"/>
              {backPreview && <img src={backPreview} alt="Dorso" className="w-full h-32 object-cover rounded-md mt-2 shadow" />}
            </div>

            {/* 🔹 Mensajes de error y éxito */}
            {errorMessage && <div className="bg-red-100 text-red-700 p-2 rounded-md">{errorMessage}</div>}
            {successMessage && <div className="bg-green-100 text-green-700 p-2 rounded-md">{successMessage}</div>}

            {/* 🔹 Botón "Almacenar Temporalmente" */}
            <button type="button" onClick={handleStoreTemporarily}
              className="w-full py-2 px-4 text-white bg-yellow-500 rounded-md shadow-md hover:bg-yellow-600 transition">
              Almacenar Temporalmente
            </button>

            {/* 🔹 Botón "Continuar Cargando" (Antes "Subir") */}
            <button type="submit" disabled={isLoading}
              className={`w-full py-2 px-4 text-white rounded-md shadow-md transition ${
                isLoading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"
              }`}>
              {isLoading ? "Procesando..." : "Continuar Cargando"}
            </button>

            {/* 🔹 Botón "Volver" */}
            <button type="button" onClick={() => navigate("/options")}
              className="w-full py-2 px-4 text-white bg-gray-400 rounded-md shadow-md hover:bg-gray-500 transition">
              Volver
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default CardUploader;
