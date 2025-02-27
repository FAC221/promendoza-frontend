import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import background from "../assets/background.jpeg"; // Imagen de fondo

const Login = () => {
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
    if (error) setError("");
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("https://promendoza.equilybrio-dev.ar/promendoza/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("authToken", data.token);
        localStorage.setItem("user", JSON.stringify(data.user || {}));

        // Redirige a OptionSelector.jsx para cualquier usuario
        navigate("/options");
      } else {
        setError(data.message || "Error en inicio de sesión");
      }
    } catch (error) {
      console.error("Error en la autenticación:", error);
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
        <h2 className="text-3xl font-bold text-center text-gray-900">Iniciar Sesión</h2>

        <form className="mt-6 space-y-4" onSubmit={handleLogin}>
          <div>
            <label className="block text-sm font-medium text-gray-700">Usuario</label>
            <input
              type="text"
              name="username"
              required
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              placeholder="Ingresa tu usuario"
              value={credentials.username}
              onChange={handleChange}
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Contraseña</label>
            <input
              type="password"
              name="password"
              required
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              placeholder="Ingresa tu contraseña"
              value={credentials.password}
              onChange={handleChange}
              disabled={isLoading}
            />
          </div>

          {error && <div className="bg-red-50 border-l-4 border-red-400 p-4 text-red-700">{error}</div>}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2 px-4 text-white bg-indigo-600 hover:bg-indigo-700 rounded-md shadow-md"
          >
            {isLoading ? "Cargando..." : "Iniciar sesión"}
          </button>
        </form>

        <p className="mt-4 text-sm text-gray-600 text-center">
          ¿No tienes una cuenta?{" "}
          <button onClick={() => navigate("/register")} className="text-indigo-600 hover:underline">
            Regístrate aquí
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;
