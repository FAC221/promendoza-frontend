import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CardUploader from "./CardUploader";
import GeneralDataForm from "./GeneralDataForm";
import EstablishmentForm from "./EstablishmentForm";
import ContactForm from "./ContactForm";
import OptionSelector from "./OptionSelector";
import background from "../assets/background.jpeg";

const MainContainer = ({ initialStep = 0 }) => {
  const navigate = useNavigate();
  const [step, setStep] = useState(initialStep);
  const [formData, setFormData] = useState({
    cardImages: null,
    generalData: {
      commercialName: "",
      companyType: "",
      otherCompanyType: "",
      website: ""
    },
    establishmentData: {
      country: "",
      state: "",
      street: "",
      number: "",
      floor: "",
      phone: ""
    },
    contactData: {
      contactName: "",
      position: "",
      primaryEmail: "",
      directPhone: ""
    }
  });

useEffect(() => {
  const analyzeSelectedCard = async (cardData) => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        navigate("/");
        return;
      }
  
      let filesToAnalyze = [];
  
      // Si la tarjeta es temporal, necesitamos subirla primero
      if (cardData.isTemporary) {
        console.log("Subiendo imágenes al servidor...");
        try {
          // Convertir los blobs a archivos
          const frontResponse = await fetch(cardData.front_image);
          const backResponse = await fetch(cardData.back_image);
          const frontBlob = await frontResponse.blob();
          const backBlob = await backResponse.blob();
  
          const formData = new FormData();
          formData.append("file", new File([frontBlob], "front.jpg", { type: "image/jpeg" }));
          formData.append("file", new File([backBlob], "back.jpg", { type: "image/jpeg" }));
  
          // Subir las imágenes
          const uploadResponse = await fetch("https://promendoza.equilybrio-dev.ar/promendoza/api/cards/upload", {
            method: "POST",
            headers: { 
              Authorization: token.startsWith('Bearer ') ? token : `Bearer ${token}`
            },
            body: formData,
          });
  
          if (!uploadResponse.ok) {
            const errorData = await uploadResponse.json().catch(() => ({}));
            console.error("Error en la respuesta del servidor:", {
              status: uploadResponse.status,
              statusText: uploadResponse.statusText,
              errorData
            });
            throw new Error(errorData.message || "Error al subir las imágenes");
          }
  
          const uploadData = await uploadResponse.json();
          console.log("Respuesta de subida:", uploadData);
  
          if (!uploadData.filenames || !Array.isArray(uploadData.filenames) || uploadData.filenames.length < 2) {
            throw new Error("No se recibieron los nombres de archivo correctamente del servidor");
          }
  
          console.log("Nombres de archivos recibidos:", uploadData.filenames);
          filesToAnalyze = uploadData.filenames;
  
        } catch (error) {
          console.error("Error al subir archivos:", error);
          throw error;
        }
      } else {
        // Si no es temporal, usar las URLs proporcionadas directamente
        filesToAnalyze = [cardData.front_image, cardData.back_image].filter(Boolean);
      }
  
      // Analizar las imágenes
      console.log("Archivos a analizar:", filesToAnalyze);
  
      const analyzeResponse = await fetch("https://promendoza.equilybrio-dev.ar/promendoza/api/cards/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token.startsWith('Bearer ') ? token : `Bearer ${token}`,
        },
        body: JSON.stringify({
          files: filesToAnalyze
        })
      });
  
      if (!analyzeResponse.ok) {
        const errorData = await analyzeResponse.json().catch(() => ({}));
        console.error("Error en el análisis:", {
          status: analyzeResponse.status,
          errorData
        });
        throw new Error(errorData.message || `Error al analizar la tarjeta`);
      }
  
      const analyzedData = await analyzeResponse.json();
      console.log("Datos analizados:", analyzedData);
  
      if (analyzedData.status === "success" && analyzedData.data) {
        setFormData({
          cardImages: filesToAnalyze,
          generalData: {
            commercialName: analyzedData.data.company_name || cardData.company_name || "",
            website: analyzedData.data.websites?.[0] || cardData.websites?.[0] || "",
            companyType: "",
            otherCompanyType: ""
          },
          establishmentData: {
            country: analyzedData.data.address_country || cardData.address_country || "",
            state: analyzedData.data.address_state || cardData.address_state || "",
            street: analyzedData.data.address_street || cardData.address_street || "",
            number: analyzedData.data.address_number || cardData.address_number || "",
            floor: "",
            phone: analyzedData.data.phone_numbers?.[0] || cardData.phone_numbers?.[0] || ""
          },
          contactData: {
            contactName: analyzedData.data.contact_name || cardData.contact_name || "",
            position: analyzedData.data.role || cardData.role || "",
            primaryEmail: analyzedData.data.emails?.[0] || cardData.emails?.[0] || "",
            directPhone: analyzedData.data.phone_numbers?.[1] || analyzedData.data.phone_numbers?.[0] || cardData.phone_numbers?.[0] || ""
          }
        });
  
        // Si la tarjeta era temporal, la eliminamos del localStorage
        if (cardData.isTemporary) {
          const storedCards = JSON.parse(localStorage.getItem("pendingCards")) || [];
          const updatedCards = storedCards.filter(card => card.id !== cardData.id);
          localStorage.setItem("pendingCards", JSON.stringify(updatedCards));
        }
  
        setStep(1);
      }
    } catch (error) {
      console.error("Error al procesar la tarjeta:", error);
      alert("Error al procesar la tarjeta: " + error.message);
      
      // En caso de error, usamos los datos originales
      setFormData({
        cardImages: [cardData.front_image, cardData.back_image].filter(Boolean),
        generalData: {
          commercialName: cardData.company_name || "",
          website: cardData.websites?.[0] || "",
          companyType: "",
          otherCompanyType: ""
        },
        establishmentData: {
          country: cardData.address_country || "",
          state: cardData.address_state || "",
          street: cardData.address_street || "",
          number: cardData.address_number || "",
          floor: "",
          phone: cardData.phone_numbers?.[0] || ""
        },
        contactData: {
          contactName: cardData.contact_name || "",
          position: cardData.role || "",
          primaryEmail: cardData.emails?.[0] || "",
          directPhone: cardData.phone_numbers?.[1] || cardData.phone_numbers?.[0] || ""
        }
      });
      setStep(1);
    }
  };
  
  
  

  const selectedCard = localStorage.getItem("selectedCard");
  if (selectedCard) {
    try {
      const cardData = JSON.parse(selectedCard);
      console.log("Cargando tarjeta pendiente:", cardData);
      
      // Analizar la tarjeta seleccionada
      analyzeSelectedCard(cardData);
      
      // Limpiar la tarjeta seleccionada del localStorage
      localStorage.removeItem("selectedCard");
    } catch (error) {
      console.error("Error al cargar datos de tarjeta:", error);
      alert("Error al cargar los datos de la tarjeta");
    }
  }
}, [navigate]);
  
  

  const handleChange = (field, value, section) => {
    setFormData((prevData) => ({
      ...prevData,
      [section]: { ...prevData[section], [field]: value },
    }));
  };

  const handleLogout = () => {
    try {
      localStorage.clear();
      navigate("/");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  // Función mejorada para formatear teléfonos
const formatPhone = (phone) => {
  if (!phone) return '';
  
  // Eliminar todos los caracteres no numéricos excepto + al inicio
  let formatted = phone
    .replace(/[^\d+]/g, '')  // Mantener solo números y +
    .trim();
  
  // Asegurarse que el + solo está al principio
  if (formatted.includes('+')) {
    formatted = '+' + formatted.replace(/\+/g, '');
  }
  
  // Validar longitud mínima y máxima (incluyendo el +)
  if (formatted.length < 6 || formatted.length > 20) {
    return '';
  }
  
  return formatted;
};

// Función para validar arrays de teléfonos
const validatePhones = (phones) => {
  if (!Array.isArray(phones)) return false;
  return phones.every(phone => {
    const formatted = formatPhone(phone);
    return formatted.length >= 6 && formatted.length <= 20;
  });
};

const cleanString = (str) => {
  return (str || '').trim();
};

const sanitizePayload = (formData) => {
  // Primero construimos la dirección completa
  const buildAddress = () => {
    const street = cleanString(formData.establishmentData.street);
    const number = cleanString(formData.establishmentData.number);
    const floor = cleanString(formData.establishmentData.floor);
    
    let address = `${street} ${number}`;
    if (floor) {
      address += ` PISO ${floor}`;
    }
    return address.trim().toUpperCase();
  };

  return {
    general_data: {
      company_commercial_name: cleanString(formData.generalData.commercialName).toUpperCase(),
      company_type: cleanString(formData.generalData.companyType).toLowerCase(),
      websites: formData.generalData.website ? [cleanString(formData.generalData.website)] : []
    },
    establishment_data: {
      address: buildAddress(),
      address_country: cleanString(formData.establishmentData.country).toUpperCase(),
      address_state: cleanString(formData.establishmentData.state).toUpperCase(),
      address_street: cleanString(formData.establishmentData.street).toUpperCase(),
      address_number: cleanString(formData.establishmentData.number),
      phones: [cleanString(formData.establishmentData.phone)].filter(Boolean)
    },
    contact_data: {
      name: cleanString(formData.contactData.contactName?.split(' ')[0] || '').toUpperCase(),
      surname: cleanString(formData.contactData.contactName?.split(' ').slice(1).join(' ') || '').toUpperCase(),
      role: cleanString(formData.contactData.position).toUpperCase(),
      email1: cleanString(formData.contactData.primaryEmail).toLowerCase(),
      phone: cleanString(formData.contactData.directPhone)
    },
    event_data: {
      name: "REGISTRO INICIAL",
      date: new Date().toISOString().split('T')[0],
      country: cleanString(formData.establishmentData.country).toUpperCase(),
      notes: "REGISTRO DESDE FORMULARIO WEB"
    }
  };
};

const handleSubmit = async () => {
  try {
    const token = localStorage.getItem("authToken");
    
    if (!token) {
      alert("Usuario no encontrado. Inicia sesión nuevamente.");
      navigate("/");
      return;
    }

    // Sanitizar y validar datos antes de enviar
    const payload = sanitizePayload(formData);

    // Validar campos requeridos
    if (!payload.establishment_data.address) {
      alert("La dirección es obligatoria. Por favor, ingrese calle y número.");
      return;
    }

    // Agregar files_data si existen
    if (Array.isArray(formData.cardImages) && formData.cardImages.length > 0) {
      payload.files_data = formData.cardImages.filter(Boolean);
    }

    console.log('Enviando payload sanitizado:', JSON.stringify(payload, null, 2));

    const response = await fetch("https://promendoza.equilybrio-dev.ar/promendoza/api/cards/save", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token.startsWith('Bearer ') ? token : `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const responseData = await response.json();

    if (!response.ok) {
      if (responseData.details) {
        alert(`Errores de validación:\n${responseData.details.join('\n')}`);
      } else {
        alert(responseData.message || 'Error al guardar los datos');
      }
      return;
    }

    alert("Datos guardados exitosamente.");
    navigate("/options-after");
  } catch (error) {
    console.error('Error en la petición:', error);
    alert(`Error al guardar los datos: ${error.message || 'Error desconocido'}`);
  }
};

// Función auxiliar para validar el payload
const validatePayload = (payload) => {
  // Validar datos generales
  if (!payload.general_data.company_commercial_name || !payload.general_data.company_type) {
    alert("Faltan campos obligatorios en datos generales");
    return false;
  }

  // Validar datos del establecimiento
  if (!payload.establishment_data.address ||
      !payload.establishment_data.address_country ||
      !payload.establishment_data.address_state ||
      !payload.establishment_data.address_street ||
      !payload.establishment_data.address_number ||
      !validatePhones(payload.establishment_data.phones)) {
    alert("Faltan campos obligatorios o inválidos en datos del establecimiento");
    return false;
  }

  // Validar datos de contacto
  if (!payload.contact_data.name ||
      !payload.contact_data.surname ||
      !payload.contact_data.role ||
      !validateEmail(payload.contact_data.email1) ||
      !formatPhone(payload.contact_data.phone)) {
    alert("Faltan campos obligatorios o inválidos en datos de contacto");
    return false;
  }

  return true;
};
  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <div className="bg-white bg-opacity-80 p-8 rounded-lg shadow-lg">
            <CardUploader 
              onDataExtracted={(data) => setFormData(prev => ({ ...prev, cardImages: data }))} 
            />
            <button
              onClick={() => setStep(1)}
              className="mt-4 w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition"
              disabled={!formData.cardImages}
            >
              Siguiente
            </button>
          </div>
        );

      case 1:
        return (
          <div className="bg-white bg-opacity-80 p-8 rounded-lg shadow-lg">
            <GeneralDataForm 
              data={formData.generalData} 
              onChange={(field, value) => handleChange(field, value, "generalData")} 
            />
            <div className="flex justify-between mt-4">
              <button
                onClick={() => setStep(0)}
                className="bg-gray-400 text-white px-4 py-2 rounded-md hover:bg-gray-500 transition"
              >
                Anterior
              </button>
              <button
                onClick={() => setStep(2)}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
                disabled={!formData.generalData.commercialName || !formData.generalData.companyType}
              >
                Siguiente
              </button>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="bg-white bg-opacity-80 p-8 rounded-lg shadow-lg">
            <EstablishmentForm 
              data={formData.establishmentData} 
              onChange={(field, value) => handleChange(field, value, "establishmentData")} 
            />
            <div className="flex justify-between mt-4">
              <button
                onClick={() => setStep(1)}
                className="bg-gray-400 text-white px-4 py-2 rounded-md hover:bg-gray-500 transition"
              >
                Anterior
              </button>
              <button
                onClick={() => setStep(3)}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
                disabled={!formData.establishmentData.country || !formData.establishmentData.street}
              >
                Siguiente
              </button>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="bg-white bg-opacity-80 p-8 rounded-lg shadow-lg">
            <ContactForm 
              data={formData.contactData} 
              onChange={(field, value) => handleChange(field, value, "contactData")} 
            />
            <div className="flex justify-between mt-4">
              <button
                onClick={() => setStep(2)}
                className="bg-gray-400 text-white px-4 py-2 rounded-md hover:bg-gray-500 transition"
              >
                Anterior
              </button>
              <button
                onClick={() => setStep(4)}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
                disabled={!formData.contactData.contactName || !formData.contactData.primaryEmail}
              >
                Siguiente
              </button>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="bg-white bg-opacity-80 p-8 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Resumen de Datos</h2>
            
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Datos Generales</h3>
              <p>Nombre Comercial: {formData.generalData.commercialName}</p>
              <p>Tipo de Empresa: {formData.generalData.companyType}</p>
              <p>Sitio Web: {formData.generalData.website}</p>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Datos del Establecimiento</h3>
              <p>País: {formData.establishmentData.country}</p>
              <p>Estado/Provincia: {formData.establishmentData.state}</p>
              <p>Dirección: {formData.establishmentData.street} {formData.establishmentData.number}</p>
              {formData.establishmentData.floor && <p>Piso: {formData.establishmentData.floor}</p>}
              <p>Teléfono: {formData.establishmentData.phone}</p>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Datos de Contacto</h3>
              <p>Nombre: {formData.contactData.contactName}</p>
              <p>Cargo: {formData.contactData.position}</p>
              <p>Email: {formData.contactData.primaryEmail}</p>
              <p>Teléfono Directo: {formData.contactData.directPhone}</p>
            </div>

            <button
              onClick={handleSubmit}
              className="w-full bg-green-500 text-white py-3 px-4 rounded-md hover:bg-green-600 transition"
            >
              Guardar
            </button>
            <button
              onClick={() => setStep(3)}
              className="mt-4 w-full bg-gray-400 text-white py-2 px-4 rounded-md hover:bg-gray-500 transition"
            >
              Anterior
            </button>
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
          className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition"
        >
          Cerrar Sesión
        </button>
      </div>
      <div className="w-full max-w-md p-4">
        {renderStep()}
      </div>
    </div>
  );
};

export default MainContainer;