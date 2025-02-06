import React from "react";
import "./ContactForm.css"; // Importamos el archivo CSS separado

const ContactForm = ({ data, onChange }) => {
  return (
    <div className="contact-form-container">
      <h2 className="contact-form-title">Datos de Contacto</h2>
      <div className="contact-form-content">
        <div className="contact-form-group">
          <label className="contact-form-label">Nombre y Apellido</label>
          <input
            type="text"
            name="contactName"
            value={data.contactName || ""}
            onChange={(e) => onChange("contactName", e.target.value)}
            className="contact-form-input"
          />
        </div>
        <div className="contact-form-group">
          <label className="contact-form-label">Cargo</label>
          <input
            type="text"
            name="position"
            value={data.position || ""}
            onChange={(e) => onChange("position", e.target.value)}
            className="contact-form-input"
          />
        </div>
        <div className="contact-form-group">
          <label className="contact-form-label">Email Primario</label>
          <input
            type="email"
            name="primaryEmail"
            value={data.primaryEmail || ""}
            onChange={(e) => onChange("primaryEmail", e.target.value)}
            className="contact-form-input"
          />
        </div>
        <div className="contact-form-group">
          <label className="contact-form-label">Email Secundario</label>
          <input
            type="email"
            name="secondaryEmail"
            value={data.secondaryEmail || ""}
            onChange={(e) => onChange("secondaryEmail", e.target.value)}
            className="contact-form-input"
          />
        </div>
        <div className="contact-form-group">
          <label className="contact-form-label">Teléfono Directo</label>
          <input
            type="tel"
            name="directPhone"
            value={data.directPhone || ""}
            onChange={(e) => onChange("directPhone", e.target.value)}
            className="contact-form-input"
          />
        </div>
      </div>
    </div>
  );
};

export default ContactForm;
