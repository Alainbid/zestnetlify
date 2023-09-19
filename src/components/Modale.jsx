import React, { useState } from "react";
import "../styles/modal.scss";
import PropTypes from "prop-types";

const Modale = (props) => {
  const [btnLabel, setbtnLabel] = useState("Supprimer");

  const changement = (e, lequel) => {
    if (e === "del") {
      props.onDelete(lequel);
    } else {
      if (lequel !== "") {
        props.onValider(lequel);
      }
    }
    setbtnLabel("Supprimer");
  };


  if (!props.open) return null;

  return (
    // <div className="modal-overlay" style={top= {posdex}}>
    <div className="modal-overlay" id="modal-cont" data-keyboard="false" data-backdrop="static">
      <div className="modal-content">
        <div className="modal-header">
          <t className="modal-tittle"> Modifier la liste</t>
        </div>

        <div className="modal-body">
          Sélection
          <input
            autoComplete="off"
            type="text"
            className="input-text"
            id="in-text"
            defaultValue={props.leQuel}
            onInput={(event) => {
              setbtnLabel("Valider");
            }}
          />
        </div>

        <div className="modal-footer">
          <button
            className="button-delete"
            id="delete"
            onClick={(event) => {
              document.getElementById("modal-cont").style.visibility = "hidden";
              event.preventDefault();
              const x = document.getElementById("in-text").value;
              btnLabel === "Supprimer"
                ? changement("del", x)
                : changement("modif", x);
            }}
          >
            {btnLabel}
          </button>

          <button
            className="button-ajouter"
            onClick={(event) => {
              event.preventDefault();
              const x = document.getElementById("in-text").value;
              document.getElementById("modal-cont").style.visibility = "hidden";
              setbtnLabel("supprimer");
              // console.log(" ajouter  = ", x);
              props.onAjouter(x);
            }}
          >
            Ajouter
          </button>

          <button className="button-annuler" onClick={props.onClose}>
            Annuler
          </button>
        </div>
      </div>
    </div>
  );
};

Modale.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  onValider: PropTypes.func,
  onDelete: PropTypes.func,
  onAjouter: PropTypes.func,
  leQuel: PropTypes.string.isRequired,
};
export default Modale;
