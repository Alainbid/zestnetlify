import React from "react";
import { NavLink } from "react-router-dom";
import "../styles/navbar.scss";

const Navbarre = () => {
  return (
    <div className="navbar">
      <div className="navbar_href">
        <NavLink to="/" className="navlk">
          Saisie
        </NavLink>
        <NavLink to="/Pointage" className="navlk">
          Pointage
        </NavLink>
        <NavLink to="/Recherche" className="navlk">
          Rechercher
        </NavLink>
        <NavLink to="/Depenses" className="navlk">
          Dépenses
        </NavLink>
        <NavLink to="/Fournisseurs" className="navlk">
          Fournisseurs
        </NavLink>
        
      </div>
    </div>
  );
};

export default Navbarre;
