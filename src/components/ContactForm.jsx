import React from "react";

const ContactForm = ({ data, onChange }) => {
  
  const handleNameChange = (value) => {
    // Asegurarse de que el usuario ingrese al menos nombre y apellido
    const names = value.trim().split(' ').filter(Boolean);
    if (names.length < 2) {
      // Puedes mostrar un mensaje de error aquí
      console.warn('Por favor ingrese nombre y apellido');
    }
    onChange('contactName', value);
  };
  
  return (
    <div className="bg-white bg-opacity-80 p-8 rounded-lg shadow-lg w-full max-w-md">
      <h2 className="text-xl font-bold mb-4">Datos de Contacto</h2>
      <div className="space-y-4">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Nombre y Apellido *
          </label>
          <input
            type="text"
            value={data.contactName}
            onChange={(e) => handleNameChange(e.target.value)}
            placeholder="Ej: Juan Pérez"
            className="w-full px-3 py-2 border rounded-md"
          />
          <span className="text-sm text-gray-500">
            Ingrese nombre y apellido separados por un espacio
          </span>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-1">Cargo</label>
          <input
            type="text"
            name="position"
            value={data.position || ""}
            onChange={(e) => onChange("position", e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-1">Email Primario</label>
          <input
            type="email"
            name="primaryEmail"
            value={data.primaryEmail || ""}
            onChange={(e) => onChange("primaryEmail", e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-1">Email Secundario</label>
          <input
            type="email"
            name="secondaryEmail"
            value={data.secondaryEmail || ""}
            onChange={(e) => onChange("secondaryEmail", e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-1">Teléfono Directo</label>
          <input
            type="tel"
            name="directPhone"
            value={data.directPhone || ""}
            onChange={(e) => onChange("directPhone", e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
      </div>
    </div>
  );
};

export default ContactForm;