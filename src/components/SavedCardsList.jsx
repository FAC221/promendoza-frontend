import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import background from "../assets/background.jpeg"; // Imagen de fondo

const SavedCardsList = () => {
  const navigate = useNavigate();
  const [savedCards, setSavedCards] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // all, pending, saved
  const [editingCard, setEditingCard] = useState(null);

  // 🔹 Obtener tarjetas desde la API
  useEffect(() => {
    const fetchSavedCards = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          setErrorMessage("No estás autorizado. Por favor, inicia sesión nuevamente.");
          setLoading(false);
          return;
        }

        const response = await fetch("https://promendoza.equilybrio-dev.ar/promendoza/api/cards/get", {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await response.json();

        if (response.ok) {
          setSavedCards(data.cards || []);
        } else {
          throw new Error(data.message);
        }
      } catch (error) {
        setErrorMessage(error.message || "Error al cargar las tarjetas.");
      } finally {
        setLoading(false);
      }
    };

    fetchSavedCards();
  }, []);

  // 🔹 Eliminar tarjeta desde la API
  const handleDeleteCard = async (cardId) => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        alert("No estás autorizado. Por favor, inicia sesión nuevamente.");
        return;
      }

      const response = await fetch(`https://promendoza.equilybrio-dev.ar/promendoza/api/cards/${cardId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("Error al eliminar la tarjeta");

      // Actualizar la lista eliminando la tarjeta
      setSavedCards((prevCards) => prevCards.filter((card) => card.id !== cardId));
      alert("Tarjeta eliminada con éxito");
    } catch (error) {
      console.error("Error al eliminar tarjeta:", error);
      alert(error.message || "Hubo un problema al eliminar la tarjeta");
    }
  };

  // 🔹 Editar una tarjeta existente
  const handleEditCard = (card) => {
    setEditingCard(card);
  };

  // 🔹 Aplicar filtros a la lista de tarjetas
  const filteredCards = savedCards.filter((card) => {
    if (filter === "all") return true;
    if (filter === "pending") return !card.isSaved;
    if (filter === "saved") return card.isSaved;
    return true;
  });

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: `url(${background})` }}
    >
      <div className="bg-white bg-opacity-80 p-8 rounded-lg shadow-lg min-h-[300px] w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Tarjetas Guardadas</h2>

        {/* 🔹 Si está editando una tarjeta, mostrar `SaveCardForm.jsx` */}
        {editingCard ? (
          <SaveCardForm cardData={editingCard} onSave={() => setEditingCard(null)} />
        ) : (
          <>
            {/* 🔹 Filtros de tarjetas */}
            <div className="mb-4">
              <label className="block text-gray-700">Filtrar por estado:</label>
              <select
                className="w-full border border-gray-300 rounded-md px-3 py-2 mt-2"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                <option value="all">Todas</option>
                <option value="pending">Pendientes</option>
                <option value="saved">Guardadas</option>
              </select>
            </div>

            {/* 🔹 Mensajes de error o carga */}
            {errorMessage && <div className="bg-red-100 text-red-700 p-2 rounded-md">{errorMessage}</div>}
            {loading && <p className="text-gray-600 text-center">Cargando tarjetas...</p>}

            {/* 🔹 Lista de tarjetas */}
            {filteredCards.length > 0 ? (
              <ul className="space-y-4">
                {filteredCards.map((card) => (
                  <li key={card.id} className="border p-4 rounded-md shadow-sm bg-gray-50">
                    <p className="text-gray-700">Razón Social: {card.company_name || "Desconocida"}</p>
                    <p className="text-gray-700">Email: {card.email || "No disponible"}</p>

                    {/* 🔹 Mostrar imágenes si están disponibles */}
                    <div className="flex justify-between mt-3">
                      {card.front_image && (
                        <img src={card.front_image} alt="Frente" className="w-16 h-16 object-cover rounded-md" />
                      )}
                      {card.back_image && (
                        <img src={card.back_image} alt="Dorso" className="w-16 h-16 object-cover rounded-md" />
                      )}
                    </div>

                    {/* 🔹 Botón para editar */}
                    <button
                      onClick={() => handleEditCard(card)}
                      className="mt-2 px-4 py-1 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition w-full"
                    >
                      Editar
                    </button>

                    {/* 🔹 Botón para eliminar */}
                    <button
                      onClick={() => handleDeleteCard(card.id)}
                      className="mt-2 px-4 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition w-full"
                    >
                      Eliminar
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-600 text-center">No hay tarjetas guardadas.</p>
            )}

            {/* 🔹 Botón para volver */}
            <button
              onClick={() => navigate("/options")}
              className="mt-4 w-full px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition"
            >
              Volver
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default SavedCardsList;
