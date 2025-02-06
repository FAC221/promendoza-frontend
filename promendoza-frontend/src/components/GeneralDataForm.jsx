import React, { useState } from "react";

const GeneralDataForm = ({ data, onChange }) => {
  const [selectedType, setSelectedType] = useState(data.companyType || "");

   const handleCompanyTypeChange = (value) => {
    setSelectedType(value);
    onChange("companyType", value);

    if (value !== "Otros") {
      onChange("otherCompanyType", "");
      onChange("governmentDetails", "");
    }
  };

  const handleOtherTypeChange = (value) => {
    onChange("otherCompanyType", value);
    // Limpiar el campo de detalles al cambiar entre opciones de gobierno
    onChange("governmentDetails", "");
  };

  const isGovernmentOption = ["Municipalidad/Ciudad", "Provincia/Estado", "Nacional"].includes(data.otherCompanyType);

  return (
    <div className="p-6 bg-white rounded-lg shadow-md w-full max-w-md">
      <h2 className="text-xl font-bold mb-4">Datos Generales</h2>
      <div className="mb-4">
        <label className="block text-gray-700 mb-1">Razón Social</label>
        <input
          type="text"
          name="companyName"
          value={data.companyName || ""}
          onChange={(e) => onChange("companyName", e.target.value)}
          className="w-full border border-gray-300 rounded-md px-3 py-2"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 mb-1">Nombre Comercial</label>
        <input
          type="text"
          name="commercialName"
          value={data.commercialName || ""}
          onChange={(e) => onChange("commercialName", e.target.value)}
          className="w-full border border-gray-300 rounded-md px-3 py-2"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 mb-1">Sitio Web</label>
        <input
          type="text"
          name="website"
          value={data.website || ""}
          onChange={(e) => onChange("website", e.target.value)}
          className="w-full border border-gray-300 rounded-md px-3 py-2"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 mb-1">Tipo de Empresa</label>
        <div className="space-y-2">
          <div>
            <input
              type="radio"
              id="exportador"
              name="companyType"
              value="Exportador"
              checked={selectedType === "Exportador"}
              onChange={(e) => handleCompanyTypeChange(e.target.value)}
            />
            <label htmlFor="exportador" className="ml-2 text-gray-700">
              Exportador
            </label>
          </div>
          <div>
            <input
              type="radio"
              id="importador"
              name="companyType"
              value="Importador"
              checked={selectedType === "Importador"}
              onChange={(e) => handleCompanyTypeChange(e.target.value)}
            />
            <label htmlFor="importador" className="ml-2 text-gray-700">
              Importador
            </label>
          </div>
          <div>
            <input
              type="radio"
              id="otros"
              name="companyType"
              value="Otros"
              checked={selectedType === "Otros"}
              onChange={(e) => handleCompanyTypeChange(e.target.value)}
            />
            <label htmlFor="otros" className="ml-2 text-gray-700">
              Otros
            </label>
          </div>
        </div>
      </div>
      {selectedType === "Otros" && (
        <div className="mb-4">
          <label className="block text-gray-700 mb-1">Seleccione Categoría</label>
          <div className="space-y-4">
            {/* Académica */}
            <fieldset>
              <legend className="text-gray-700 font-bold">Académica</legend>
              <div>
                <input
                  type="radio"
                  id="universidades"
                  name="otherCompanyType"
                  value="Universidades"
                  checked={data.otherCompanyType === "Universidades"}
                  onChange={(e) => handleOtherTypeChange(e.target.value)}
                />
                <label htmlFor="universidades" className="ml-2">
                  Universidades
                </label>
              </div>
              <div>
                <input
                  type="radio"
                  id="institutos"
                  name="otherCompanyType"
                  value="Institutos terciarios"
                  checked={data.otherCompanyType === "Institutos terciarios"}
                  onChange={(e) => handleOtherTypeChange(e.target.value)}
                />
                <label htmlFor="institutos" className="ml-2">
                  Institutos terciarios
                </label>
              </div>
              <div>
                <input
                  type="radio"
                  id="centros"
                  name="otherCompanyType"
                  value="Institutos o centros de investigación"
                  checked={
                    data.otherCompanyType === "Institutos o centros de investigación"
                  }
                  onChange={(e) => handleOtherTypeChange(e.target.value)}
                />
                <label htmlFor="centros" className="ml-2">
                  Centros de investigación
                </label>
              </div>
              <div>
                <input
                  type="radio"
                  id="primarios"
                  name="otherCompanyType"
                  value="Establecimientos primarios o secundarios"
                  checked={
                    data.otherCompanyType === "Establecimientos primarios o secundarios"
                  }
                  onChange={(e) => handleOtherTypeChange(e.target.value)}
                />
                <label htmlFor="primarios" className="ml-2">
                  Establecimientos primarios o secundarios
                </label>
              </div>
            </fieldset>
            {/* Asociación Civil */}
            <fieldset>
              <legend className="text-gray-700 font-bold">Asociación civil</legend>
              <div>
                <input
                  type="radio"
                  id="fundacion"
                  name="otherCompanyType"
                  value="Fundación"
                  checked={data.otherCompanyType === "Fundación"}
                  onChange={(e) => handleOtherTypeChange(e.target.value)}
                />
                <label htmlFor="fundacion" className="ml-2">
                  Fundación
                </label>
              </div>
              <div>
                <input
                  type="radio"
                  id="clusters"
                  name="otherCompanyType"
                  value="Clusters"
                  checked={data.otherCompanyType === "Clusters"}
                  onChange={(e) => handleOtherTypeChange(e.target.value)}
                />
                <label htmlFor="clusters" className="ml-2">
                  Clusters
                </label>
              </div>
              <div>
                <input
                  type="radio"
                  id="asociacion"
                  name="otherCompanyType"
                  value="Asociación sin fines de lucro"
                  checked={data.otherCompanyType === "Asociación sin fines de lucro"}
                  onChange={(e) => handleOtherTypeChange(e.target.value)}
                />
                <label htmlFor="asociacion" className="ml-2">
                  Asociación sin fines de lucro
                </label>
              </div>
              <div>
                <input
                  type="radio"
                  id="camaras"
                  name="otherCompanyType"
                  value="Cámaras empresariales"
                  checked={data.otherCompanyType === "Cámaras empresariales"}
                  onChange={(e) => handleOtherTypeChange(e.target.value)}
                />
                <label htmlFor="camaras" className="ml-2">
                  Cámaras empresariales
                </label>
              </div>
            </fieldset>
            {/* Gobierno */}
            <fieldset>
              <legend className="text-gray-700 font-bold">Gobierno</legend>
              <div>
                <input
                  type="radio"
                  id="municipalidad"
                  name="otherCompanyType"
                  value="Municipalidad/Ciudad"
                  checked={data.otherCompanyType === "Municipalidad/Ciudad"}
                  onChange={(e) => handleOtherTypeChange(e.target.value)}
                />
                <label htmlFor="municipalidad" className="ml-2">
                  Municipalidad/Ciudad
                </label>
              </div>
              <div>
                <input
                  type="radio"
                  id="provincia"
                  name="otherCompanyType"
                  value="Provincia/Estado"
                  checked={data.otherCompanyType === "Provincia/Estado"}
                  onChange={(e) => handleOtherTypeChange(e.target.value)}
                />
                <label htmlFor="provincia" className="ml-2">
                  Provincia/Estado
                </label>
              </div>
              <div>
                <input
                  type="radio"
                  id="nacional"
                  name="otherCompanyType"
                  value="Nacional"
                  checked={data.otherCompanyType === "Nacional"}
                  onChange={(e) => handleOtherTypeChange(e.target.value)}
                />
                <label htmlFor="nacional" className="ml-2">
                  Nacional
                </label>
              </div>
            </fieldset>
          </div>
        </div>
      )}
      {isGovernmentOption && (
        <div className="mb-4">
          <label className="block text-gray-700 mb-1">Especifique detalles</label>
          <input
            type="text"
            value={data.governmentDetails || ""}
            onChange={(e) => onChange("governmentDetails", e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2"
            placeholder="Ingrese los detalles específicos"
          />
        </div>
      )}
    </div>
  );
};

export default GeneralDataForm;
