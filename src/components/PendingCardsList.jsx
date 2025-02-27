import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import background from "../assets/background.jpeg";

const PendingCardsList = () => {
  const navigate = useNavigate();
  const [pendingCards, setPendingCards] = useState([]);
  const [tempCards, setTempCards] = useState([]);
  const [loading, setLoading] = useState(false); // Estado de carga

  useEffect(() => {
    const fetchPendingCards = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          navigate("/");
          return;
        }

        const response = await fetch("https://promendoza.equilybrio-dev.ar/promendoza/api/cards/get", {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await response.json();
        if (response.ok) {
          setPendingCards(data.cards || []);
        }
      } catch (error) {
        console.error("Error al cargar las tarjetas pendientes:", error);
      }
    };

    fetchPendingCards();
    const storedTempCards = JSON.parse(localStorage.getItem("pendingCards")) || [];
    setTempCards(storedTempCards);
  }, [navigate]);

  const handleSelectCard = (card) => {
    setLoading(true); // Activar carga
    localStorage.setItem("selectedCard", JSON.stringify(card));

    // Simulación de retraso antes de la redirección (puedes eliminarlo si no es necesario)
    setTimeout(() => {
      navigate("/automatic");
    }, 1500);
  };

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${background})` }}
    >
      <div className="bg-white bg-opacity-90 p-6 rounded-lg shadow-lg w-full max-w-lg">
        <h2 className="text-xl font-bold text-center mb-4">Selecciona una Tarjeta Pendiente</h2>

        {loading ? (
          // 🔄 Animación de carga mientras se procesa la selección
          <div className="flex flex-col items-center justify-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-solid"></div>
            <p className="mt-4 text-gray-700">Cargando...</p>
          </div>
        ) : (
          <ul className="space-y-4">
            {tempCards.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Tarjetas Almacenadas Temporalmente</h3>
                {tempCards.map((card) => (
                  <li key={card.id} 
                      className="border p-4 rounded-md shadow-sm bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors"
                      onClick={() => handleSelectCard(card)}>
                    <p className="text-gray-700 font-semibold">Tarjeta Temporal</p>
                    <div className="flex space-x-4 mt-2">
                      <img src={card.front_image} alt="Frente" className="w-16 h-16 object-cover rounded-md" />
                      <img src={card.back_image} alt="Dorso" className="w-16 h-16 object-cover rounded-md" />
                    </div>
                  </li>
                ))}
              </div>
            )}

            {pendingCards.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mt-6">Tarjetas Pendientes en el Backend</h3>
                {pendingCards.map((card) => (
                  <li key={card.id} 
                      className="border p-4 rounded-md shadow-sm bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors"
                      onClick={() => handleSelectCard(card)}>
                    <p className="text-gray-700">Razón Social: {card.company_name || "Desconocida"}</p>
                    <p className="text-gray-700">Email: {card.email || "No disponible"}</p>
                    <div className="flex space-x-4 mt-2">
                      {card.front_image && <img src={card.front_image} alt="Frente" className="w-16 h-16 object-cover rounded-md" />}
                      {card.back_image && <img src={card.back_image} alt="Dorso" className="w-16 h-16 object-cover rounded-md" />}
                    </div>
                  </li>
                ))}
              </div>
            )}

            {pendingCards.length === 0 && tempCards.length === 0 && (
              <p className="text-center text-gray-600">No hay tarjetas pendientes</p>
            )}
          </ul>
        )}

        {!loading && (
          <div className="mt-4 space-y-2">
            <button 
              onClick={() => navigate("/automatic")}
              
              className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
            >
              Cargar Nueva Tarjeta
            </button>
            <button 
              onClick={() => navigate("/options")}
              className="w-full bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500 transition"
            >
              Volver
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PendingCardsList;
