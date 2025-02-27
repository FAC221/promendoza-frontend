import React, { useState, useEffect } from "react";
import "./styles/EstablishmentForm.css"; // Importamos el archivo CSS separado
import countriesData from '../data/countriesData'

const EstablishmentForm = ({ data, onChange }) => {
  const [states, setStates] = useState([]);
  
  // Convertir el objeto de países a un array ordenado alfabéticamente
  const countries = Object.values(countriesData)
    .map(country => ({
      nombre: country.nombre,
      codigo: country.codigo
    }))
    .sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'));

  // Manejar el cambio de país y actualizar los estados
  const handleCountryChange = (selectedCountry) => {
    const countryData = countriesData[selectedCountry];
    if (countryData) {
      // Ordenar los estados alfabéticamente
      setStates(countryData.estados.sort((a, b) => a.localeCompare(b, 'es')));
      onChange("country", selectedCountry);
      onChange("state", ""); // Limpiar el estado seleccionado
    } else {
      setStates([]);
      onChange("country", selectedCountry);
      onChange("state", "");
    }
  };

  // Actualizar estados cuando se monta el componente si hay un país seleccionado
  useEffect(() => {
    if (data.country) {
      const countryData = countriesData[data.country];
      if (countryData) {
        setStates(countryData.estados);
      }
    }
  }, [data.country]);

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
              <option key={country.codigo} value={country.nombre}>
                {country.nombre}
              </option>
            ))}
          </select>
        </div>

        <div className="establishment-form-group">
          <label className="establishment-form-label">Estado/Provincia</label>
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