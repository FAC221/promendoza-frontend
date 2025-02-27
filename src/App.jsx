import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AppLayout from "./components/AppLayout"; 
import Login from "./pages/login";
import Register from "./pages/Register";
import OptionSelector from "./components/OptionSelector";
import MainContainer from "./components/MainContainer";
import OptionsAfterSave from "./components/OptionsAfterSave";
import SavedCardsList from "./components/SavedCardsList";
import CardUploader from "./components/CardUploader"; 
import PendingCardsList from "./components/PendingCardsList"; 
import Dashboard from "./pages/Dashboard"; // ✅ Importamos el Dashboard

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Rutas de autenticación (sin layout) */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Rutas protegidas dentro del layout */}
        <Route element={<AppLayout />}>
          <Route path="/options" element={<OptionSelector />} />
          <Route path="/saved-cards" element={<SavedCardsList />} />
          <Route path="/manual" element={<MainContainer initialStep={1} />} />
          <Route path="/automatic" element={<MainContainer initialStep={0} />} />
          <Route path="/options-after" element={<OptionsAfterSave />} />
          <Route path="/upload-card" element={<CardUploader />} /> 
          <Route path="/pending-cards" element={<PendingCardsList />} /> 
          <Route path="/dashboard" element={<Dashboard />} /> {/* ✅ Nueva ruta agregada */}
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
