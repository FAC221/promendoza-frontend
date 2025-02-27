import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import background from "../assets/background.jpeg";


const Dashboard = () => {
  const navigate = useNavigate();
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCard, setSelectedCard] = useState(null);
  const [editRequest, setEditRequest] = useState({ reason: "", user: "" });
  const [deleteRequest, setDeleteRequest] = useState({ reason: "", user: "" });

  // 🔹 Cargar tarjetas desde la API
  useEffect(() => {
    const fetchCards = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          alert("No autorizado, inicia sesión.");
          navigate("/");
          return;
        }

        const response = await fetch("https://promendoza.equilybrio-dev.ar/promendoza/api/cards/get", {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await response.json();
        if (response.ok) {
          setCards(data.cards || []);
        } else {
          throw new Error(data.message);
        }
      } catch (error) {
        console.error("Error al cargar tarjetas:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCards();
  }, [navigate]);

  // 🔹 Generar un PDF con los datos de la tarjeta (sin imágenes)
  const generatePDF = (card) => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Detalles de Tarjeta", 10, 10);

    doc.setFontSize(12);
    doc.text(`Razón Social: ${card.company_name || "Desconocida"}`, 10, 30);
    doc.text(`Email: ${card.email || "No disponible"}`, 10, 40);
    doc.text(`Fecha de Creación: ${new Date(card.created_at).toLocaleDateString()}`, 10, 50);

    doc.save(`Tarjeta_${card.company_name}.pdf`);
  };

  // 🔹 Solicitar eliminación de tarjeta
  const handleDeleteRequest = async (card) => {
    const user = prompt("Ingrese su nombre para la solicitud de eliminación:");
    if (!user) return;

    const reason = prompt("Motivo de la solicitud:");
    if (!reason) return;

    const requestData = {
      card_id: card.id,
      requested_by: user,
      reason,
      date: new Date().toISOString(),
    };

    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch("https://promendoza.equilybrio-dev.ar/promendoza/api/cards/request-delete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) throw new Error("Error al enviar solicitud");

      alert("Solicitud de eliminación enviada correctamente.");
    } catch (error) {
      console.error("Error al solicitar eliminación:", error);
      alert("No se pudo enviar la solicitud de eliminación.");
    }
  };

  // 🔹 Solicitar modificación de tarjeta
  const handleEditRequest = async (card) => {
    const user = prompt("Ingrese su nombre para la solicitud de modificación:");
    if (!user) return;

    const reason = prompt("Motivo de la modificación:");
    if (!reason) return;

    const requestData = {
      card_id: card.id,
      requested_by: user,
      reason,
      date: new Date().toISOString(),
    };

    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch("https://promendoza.equilybrio-dev.ar/promendoza/api/cards/request-edit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) throw new Error("Error al enviar solicitud");

      alert("Solicitud de modificación enviada correctamente.");
    } catch (error) {
      console.error("Error al solicitar modificación:", error);
      alert("No se pudo enviar la solicitud de modificación.");
    }
  };

  // 🔹 Abrir detalle de tarjeta
  const handleOpenDetail = (card) => {
    setSelectedCard(card);
  };

  // 🔹 Cerrar detalle de tarjeta
  const handleCloseDetail = () => {
    setSelectedCard(null);
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center bg-cover bg-center p-6"
      style={{ backgroundImage: `url(${background})` }}
    >
      <div className="bg-white bg-opacity-90 p-6 rounded-lg shadow-lg w-full max-w-4xl">
        <h1 className="text-2xl font-bold text-gray-800 mb-4 text-center">📊 Panel de Tarjetas</h1>

        {/* 🔍 Barra de búsqueda */}
        <input
          type="text"
          placeholder="🔍 Buscar por empresa..."
          className="border px-3 py-2 rounded-md w-full mb-4"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* 📌 Listado de tarjetas */}
        {loading ? (
          <p className="text-center text-gray-600">Cargando tarjetas...</p>
        ) : cards.length === 0 ? (
          <p className="text-center text-gray-600">No hay tarjetas disponibles.</p>
        ) : (
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-2">Razón Social</th>
                <th className="border p-2">Email</th>
                <th className="border p-2">Fecha</th>
                <th className="border p-2">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {cards
                .filter((card) =>
                  card.company_name.toLowerCase().includes(search.toLowerCase())
                )
                .map((card) => (
                  <tr key={card.id} className="text-center bg-white hover:bg-gray-100 transition">
                    <td className="border p-2">{card.company_name || "Desconocida"}</td>
                    <td className="border p-2">{card.email || "No disponible"}</td>
                    <td className="border p-2">{new Date(card.created_at).toLocaleDateString()}</td>
                    <td className="border p-2 space-x-2">
                      <button onClick={() => generatePDF(card)} className="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600">
                        PDF
                      </button>
                      <button onClick={() => handleOpenDetail(card)} className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600">
                        Ver
                      </button>
                      <button onClick={() => handleEditRequest(card)} className="bg-yellow-500 text-white px-3 py-1 rounded-md hover:bg-yellow-600">
                        Modificar
                      </button>
                      <button onClick={() => handleDeleteRequest(card)} className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600">
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
