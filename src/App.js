import React from "react";
import "./styles/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Saisie from "./pages/Saisie";
import Depenses from './pages/Depenses';
import Fournisseurs from './pages/Fournisseurs'
import Pointage from './pages/Pointage';
import Recherche from './pages/Recherche'

function App() {
  
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Saisie />}></Route>
        <Route path="/Pointage" element={<Pointage />}></Route>
        <Route path="/Recherche" element={<Recherche />}></Route>
        <Route   path="/Depenses"   Component={Depenses}></Route>
        <Route path="/Fournisseurs" element={<Fournisseurs />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
