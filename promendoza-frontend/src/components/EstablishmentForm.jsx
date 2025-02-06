import React, { useState, useEffect } from "react";
import "./styles/EstablishmentForm.css"; // Importamos el archivo CSS separado

const EstablishmentForm = ({ data, onChange }) => {
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);

  // Obtener países y estados del backend
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch("/promendoza/api/form/countries");
        const result = await response.json();
        if (result.success) {
          setCountries(result.data);
        } else {
          console.error("Error al obtener países:", result.message);
        }
      } catch (error) {
        console.error("Error al conectarse al backend:", error);
      }
    };

    fetchCountries();
  }, []);

  // Manejar el cambio de país y actualizar los estados
  const handleCountryChange = (country) => {
    const selectedCountry = countries.find(
      (c) => c.country.trim().toLowerCase() === country.trim().toLowerCase()
    );

    setStates(selectedCountry ? selectedCountry.states : []);
    onChange("country", selectedCountry ? selectedCountry.country : country);
    onChange("state", ""); // Limpiar el estado/provincia seleccionado
  };

  return (
    <div className="establishment-form-container">
      <h2 className="establishment-form-title">Datos del Establecimiento</h2>
      <div className="establishment-form-content">
        <div className="establishment-form-group">
          <label className="establishment-form-label">País</label>
          <select
            name="country"
            value={data.country || ""}
            onChange={(e) => handleCountryChange(e.target.value)}
            className="establishment-form-input"
          >
            <option value="">Seleccione</option>
            {countries.map((country) => (
              <option key={country.country} value={country.country}>
                {country.country}
              </option>
            ))}
          </select>
        </div>

        <div className="establishment-form-group">
          <label className="establishment-form-label">Estado</label>
          <select
            name="state"
            value={data.state || ""}
            onChange={(e) => onChange("state", e.target.value)}
            className="establishment-form-input"
            disabled={!states.length}
          >
            <option value="">Seleccione</option>
            {states.map((state) => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </select>
        </div>

        <div className="establishment-form-group">
          <label className="establishment-form-label">Calle</label>
          <input
            type="text"
            name="street"
            value={data.street || ""}
            onChange={(e) => onChange("street", e.target.value)}
            className="establishment-form-input"
          />
        </div>

        <div className="establishment-form-group">
          <label className="establishment-form-label">Número</label>
          <input
            type="text"
            name="number"
            value={data.number || ""}
            onChange={(e) => onChange("number", e.target.value)}
            className="establishment-form-input"
          />
        </div>

        <div className="establishment-form-group">
          <label className="establishment-form-label">Piso</label>
          <input
            type="text"
            name="floor"
            value={data.floor || ""}
            onChange={(e) => onChange("floor", e.target.value)}
            className="establishment-form-input"
          />
        </div>

        <div className="establishment-form-group">
          <label className="establishment-form-label">Teléfono</label>
          <input
            type="tel"
            name="phone"
            value={data.phone || ""}
            onChange={(e) => onChange("phone", e.target.value)}
            className="establishment-form-input"
          />
        </div>
      </div>
    </div>
  );
};

export default EstablishmentForm;
