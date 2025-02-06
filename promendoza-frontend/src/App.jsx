import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/login";
import OptionSelector from "./components/OptionSelector";
import MainContainer from "./components/MainContainer";
import OptionsAfterSave from "./components/OptionsAfterSave";
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/options" element={<OptionSelector />} />
        <Route
          path="/manual"
          element={<MainContainer initialStep={1} />} // Inicia en el formulario manual
        />
        <Route
          path="/automatic"
          element={<MainContainer initialStep={0} />} // Inicia con carga de tarjeta
        />
        <Route path="/options-after" element={<OptionsAfterSave />} />
      </Routes>
    </Router>
  );
};

export default App;
