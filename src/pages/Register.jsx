import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import background from "../assets/background.jpeg"; // Imagen de fondo

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    full_name: "",
    password: "",
    dni: "",
    email: "",
    phone: "",
    role: "CLIENT", // 🔹 Valor predeterminado "CLIENT"
  });

  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError("");
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      const response = await fetch("https://promendoza.equilybrio-dev.ar/promendoza/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage(data.message || "Registro exitoso");
        setTimeout(() => {
          navigate("/");
        }, 2000);
      } else {
        setError(data.message || "Error en el registro");
      }
    } catch (error) {
      console.error("Error en el registro:", error);
      setError("No se pudo conectar con el servidor");
    }

    setIsLoading(false);
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center"
      style={{ backgroundImage: `url(${background})` }}
    >
      <div className="w-full max-w-md bg-white bg-opacity-80 p-8 rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold text-center text-gray-900">Crear Cuenta</h2>

        <form className="mt-6 space-y-4" onSubmit={handleRegister}>
          {[
            { name: "username", label: "Usuario" },
            { name: "full_name", label: "Nombre Completo" },
            { name: "password", label: "Contraseña" },
            { name: "dni", label: "DNI" },
            { name: "email", label: "Correo Electrónico" },
            { name: "phone", label: "Teléfono" },
          ].map((field, idx) => (
            <div key={idx}>
              <label className="block text-sm font-medium text-gray-700">{field.label}</label>
              <input
                type={field.name === "password" ? "password" : "text"}
                name={field.name}
                required
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                placeholder={`Ingrese su ${field.label}`}
                value={formData[field.name]}
                onChange={handleChange}
                disabled={isLoading}
              />
            </div>
          ))}

          {/* 🔹 Selector de Rol */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Rol</label>
            <select
              name="role"
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              value={formData.role}
              onChange={handleChange}
              required
              disabled={isLoading}
            >
              <option value="CLIENT">Usuario</option>
              <option value="ADMIN">Administrador</option>
            </select>
          </div>

          {error && <div className="bg-red-50 border-l-4 border-red-400 p-4 text-red-700">{error}</div>}
          {successMessage && <div className="bg-green-50 border-l-4 border-green-400 p-4 text-green-700">{successMessage}</div>}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2 px-4 text-white bg-indigo-600 hover:bg-indigo-700 rounded-md shadow-md"
          >
            {isLoading ? "Registrando..." : "Crear cuenta"}
          </button>
        </form>

        <p className="mt-4 text-sm text-gray-600 text-center">
          ¿Ya tienes una cuenta?{" "}
          <button onClick={() => navigate("/")} className="text-indigo-600 hover:underline">
            Inicia sesión
          </button>
        </p>
      </div>
    </div>
  );
};

export default Register;
