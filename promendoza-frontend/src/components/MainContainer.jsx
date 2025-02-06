import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import CardUploader from "./CardUploader";
import GeneralDataForm from "./GeneralDataForm";
import EstablishmentForm from "./EstablishmentForm";
import ContactForm from "./ContactForm";
import OptionSelector from "./optionSelector";
import background from "../assets/background.jpeg";

const MainContainer = ({ initialStep = 0 }) => {
  const navigate = useNavigate();
  const [step, setStep] = useState(initialStep);
  const [formData, setFormData] = useState({
    cardImages: null,
    generalData: {},
    establishmentData: { country: "", state: "", street: "", number: "", floor: "", phone: "" },
    contactData: {},
  });

  const handleCardUpload = (extractedData) => {
      // Corregido el parámetro data a extractedData
      console.log("Datos recibidos:", extractedData);
      setFormData({
        ...formData,
        cardImages: [extractedData.front_image, extractedData.back_image], // Agregamos las imágenes
        generalData: {
          commercialName: extractedData.company_name || "",
          website: extractedData.websites?.[0] || "",
        },
        contactData: {
          contactName: extractedData.contact_name || "",
          position: extractedData.role || "",
          primaryEmail: extractedData.emails?.[0] || "",
          directPhone: extractedData.phone_numbers?.[0] || "",
        },
      });
      setStep(1);
    };


  const handleGeneralDataChange = (field, value) => {
    setFormData((prevData) => {
        const updatedGeneralData = { ...prevData.generalData, [field]: value };
        
        if (field === "companyType" || field === "otherCompanyType") {
          const { companyType, otherCompanyType } = updatedGeneralData;

          // Añadir detalles de gobierno si aplica
          let fullType = companyType === "Otros" && otherCompanyType ?
            `Otros - ${otherCompanyType}` : companyType;

          if (["Municipalidad/Ciudad", "Provincia/Estado", "Nacional"].includes(otherCompanyType)
              && updatedGeneralData.governmentDetails) {
            fullType += ` - ${updatedGeneralData.governmentDetails}`;
          }

          updatedGeneralData.fullCompanyType = fullType;
        }
        return { ...prevData, generalData: updatedGeneralData };
      });
    };


  const handleEstablishmentDataChange = (field, value) => {
      setFormData((prevData) => ({
        ...prevData,
        establishmentData: { ...prevData.establishmentData, [field]: value },
      }));
    };


  const handleContactDataChange = (field, value) => {
    setFormData({
      ...formData,
      contactData: { ...formData.contactData, [field]: value },
    });
  };

  const handleLogout = () => {
    try {
      localStorage.clear(); // Limpia todo el localStorage
      navigate('/');
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };


  const handleSubmit = async () => {
      try {
        // Obtener el token y el user del localStorage
        const token = localStorage.getItem('authToken');
        const userString = localStorage.getItem('user');
        const user = userString ? JSON.parse(userString) : null;

        // Verificar si existe el token y el userId
        if (!token || !user?.userId) {
          alert("No estás autorizado. Por favor, inicia sesión nuevamente.");
          navigate('/');
          return;
        }

        // Construir el payload final
        const payload = {
          ...formData,
          generalData: {
            ...formData.generalData,
            fullCompanyType: formData.generalData.companyType === "Otros"
              ? `Otros - ${formData.generalData.otherCompanyType}`
              : formData.generalData.companyType,
          },
          userId: user.userId, // Agregar el userId al payload
        };

        const response = await fetch("/promendoza/api/save-data", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });

        if (response.ok) {
          alert("Datos guardados exitosamente.");
          navigate('/options-after');
        } else {
          if (response.status === 401 || response.status === 403) {
            alert("Tu sesión ha expirado. Por favor, inicia sesión nuevamente.");
            navigate('/');
          } else {
            alert("Error al guardar los datos.");
          }
        }
      } catch (error) {
        console.error("Error:", error);
        alert("Error al enviar los datos.");
      }
    };

  const renderStep = () => {
    switch (step) {
      case 0:
        return <CardUploader onDataExtracted={handleCardUpload} />;
      case 1:
        return (
          <GeneralDataForm
            data={formData.generalData}
            onChange={handleGeneralDataChange}
          />
        );
      case 2:
        return (
          <EstablishmentForm
            data={formData.establishmentData}
            onChange={handleEstablishmentDataChange}
          />
        );
      case 3:
        return (
          <ContactForm
            data={formData.contactData}
            onChange={handleContactDataChange}
          />
        );
      case 4:
        return (
          <div className="bg-white bg-opacity-80 p-8 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Resumen de Datos</h2>

            {/* Sección de Imágenes */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3 text-gray-700 border-b pb-2">
                Imágenes Cargadas
              </h3>
              {formData.cardImages ? (
                <div className="bg-gray-50 p-3 rounded-md">
                  <p className="text-sm text-gray-600">
                    {formData.cardImages.length} {formData.cardImages.length === 1 ? 'imagen cargada' : 'imágenes cargadas'}
                  </p>
                </div>
              ) : (
                <p className="text-sm text-gray-500 italic">No se han cargado imágenes</p>
              )}
            </div>

            {/* Sección de Datos Generales */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3 text-gray-700 border-b pb-2">
                Datos Generales
              </h3>
              <div className="grid grid-cols-1 gap-3">
                <div className="bg-gray-50 p-3 rounded-md">
                  <p className="text-sm font-medium text-gray-600">Razón Social</p>
                  <p className="text-gray-800">{formData.generalData.companyName || '-'}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-md">
                  <p className="text-sm font-medium text-gray-600">Nombre Comercial</p>
                  <p className="text-gray-800">{formData.generalData.commercialName || '-'}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-md">
                  <p className="text-sm font-medium text-gray-600">Sitio Web</p>
                  <p className="text-gray-800">{formData.generalData.website || '-'}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-md">
                  <p className="text-sm font-medium text-gray-600">Tipo de Empresa</p>
                  <p className="text-gray-800">{formData.generalData.fullCompanyType || '-'}</p>
                </div>
              </div>
            </div>

            {/* Sección de Datos del Establecimiento */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3 text-gray-700 border-b pb-2">
                Datos del Establecimiento
              </h3>
              <div className="grid grid-cols-1 gap-3">
                <div className="bg-gray-50 p-3 rounded-md">
                  <p className="text-sm font-medium text-gray-600">País</p>
                  <p className="text-gray-800">{formData.establishmentData.country || '-'}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-md">
                  <p className="text-sm font-medium text-gray-600">Estado</p>
                  <p className="text-gray-800">{formData.establishmentData.state || '-'}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-md">
                  <p className="text-sm font-medium text-gray-600">Calle</p>
                  <p className="text-gray-800">{formData.establishmentData.street || '-'}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-md">
                  <p className="text-sm font-medium text-gray-600">Número</p>
                  <p className="text-gray-800">{formData.establishmentData.number || '-'}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-md">
                  <p className="text-sm font-medium text-gray-600">Piso</p>
                  <p className="text-gray-800">{formData.establishmentData.floor || '-'}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-md">
                  <p className="text-sm font-medium text-gray-600">Teléfono</p>
                  <p className="text-gray-800">{formData.establishmentData.phone || '-'}</p>
                </div>
              </div>
            </div>

            {/* Sección de Datos de Contacto */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3 text-gray-700 border-b pb-2">
                Datos de Contacto
              </h3>
              <div className="grid grid-cols-1 gap-3">
                <div className="bg-gray-50 p-3 rounded-md">
                  <p className="text-sm font-medium text-gray-600">Nombre y Apellido</p>
                  <p className="text-gray-800">{formData.contactData.contactName || '-'}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-md">
                  <p className="text-sm font-medium text-gray-600">Cargo</p>
                  <p className="text-gray-800">{formData.contactData.position || '-'}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-md">
                  <p className="text-sm font-medium text-gray-600">Email Primario</p>
                  <p className="text-gray-800">{formData.contactData.primaryEmail || '-'}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-md">
                  <p className="text-sm font-medium text-gray-600">Email Secundario</p>
                  <p className="text-gray-800">{formData.contactData.secondaryEmail || '-'}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-md">
                  <p className="text-sm font-medium text-gray-600">Teléfono Directo</p>
                  <p className="text-gray-800">{formData.contactData.directPhone || '-'}</p>
                </div>
              </div>
            </div>

            {/* Botones de Acción */}
            <div className="flex gap-4 mt-6">
              <button
                onClick={() => navigate("/options")}
                className="w-1/2 bg-red-500 text-white py-3 px-4 rounded-md hover:bg-red-600 transition font-medium shadow-sm"
              >
                Cancelar
              </button>
              <button
                onClick={handleSubmit}
                className="w-1/2 bg-green-500 text-white py-3 px-4 rounded-md hover:bg-green-600 transition font-medium shadow-sm"
              >
                Guardar
              </button>
            </div>
          </div>
        );

      default:
        return <OptionSelector />;
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center"
      style={{ backgroundImage: `url(${background})` }}
    >
      <div className="absolute top-4 right-4 z-10">
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition shadow-lg flex items-center space-x-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
            />
          </svg>
          <span>Cerrar Sesión</span>
        </button>
      </div>
      <div className="w-full max-w-md p-4">
        {renderStep()}
        {step > 0 && step < 4 && (
          <div className="flex justify-between mt-4">
            {step > 0 && (
              <button
                onClick={() => setStep(step - 1)}
                className="bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition"
              >
                Anterior
              </button>
            )}
            {step < 4 && (
              <button
                onClick={() => setStep(step + 1)}
                className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition"
              >
                Siguiente
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MainContainer;