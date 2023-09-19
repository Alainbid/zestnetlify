import React, { useState, useEffect, useCallback } from "react";
import Navbarre from "../components/Navbar";
import Calendar from "../components/Calendrier";
import "../styles/saisie.scss";
import { db } from "../pages/Firebasefirestore";
import { collection, addDoc } from "firebase/firestore";
import { useForm } from "react-hook-form";
import ListeDepenses from "../components/Listedepenses";

function Saisie() {
  const journalCollectionRef = collection(db, "cfbjournal");
  const [banque, setBanque] = useState("BOURSO");
  const [menage, setMenage] = useState(true);
  const [mode, setMode] = useState("Visa");
  const [temps, setTemps] = useState(0);
  const [somme, setSomme] = useState("");
  const [navHidden, setNavHidden] = useState(true);
  const { register, handleSubmit } = useForm();
  const [showCalendar, setShowCalendar] = useState(true);
  const [listDepPosition, setListDepBenPosition] = useState([0, 0]);
  const [showListdepbenef, setShowListdepbenef] = useState("");
  const [natureDepense, setNatureDepense] = useState("");
  const [quiBenef, setQuiBenef] = useState("");

  const onSubmit = async (data) => {
    //console.log("somme",somme);
    if (somme !== "") {
      data.new = false;
      data.numero = "";
      data.somme = somme;
      data.mode = mode;
      data.banque = banque;
      data.menage = menage;
      data.temps = temps;
      data.pointe = false;
      data.date = temps;
      data.nature = natureDepense;
      data.benef = quiBenef;
      

      await addDoc(journalCollectionRef, data);
      console.log("data", data);
    }
    annuler();
  };

  const handleChange = (e) => {
    setMode(e.target.value);
  };
  const modifBanque = (e) => {
    setBanque(e.target.value);
  };

  const modifMenage = (e) => {
    e.target.checked ? setMenage(true) : setMenage(false);
  };

  const modifSomme = (e) => {
    setSomme(parseFloat(e.target.value));
  };

  const getData = (ladateh) => {
    document.getElementById("saisie-container").style.display = "revert";
    console.log("dat", ladateh);
    setTemps(ladateh);
    setShowCalendar(false);
    setNavHidden(false);
  };

  const annuler = () => {
    window.location.reload(true);
  };

  const choixDepBenef = useCallback(() => {
    document.getElementById("nature").value = natureDepense;
    document.getElementById("benef").value = quiBenef;
  }, [natureDepense, quiBenef]);

  useEffect(() => {
    choixDepBenef();
  }, [choixDepBenef]);

  return (
    <div id="app">
      {navHidden ? <Navbarre></Navbarre> : null}

      <h1 id="h1-saisie">Saisie d&apos;écritures</h1>
      {showCalendar && (
        <Calendar id="calencar" pourqui={"saisie"} sendData={getData} />
      )}
      <ListeDepenses
        open={showListdepbenef}
        onValider={(x, qui) => {
          qui === "benef" ? setQuiBenef(x) : setNatureDepense(x);
          console.log("x", x);
        }}
        onClose={() => {
          setShowListdepbenef("");
        }}
        posdex={listDepPosition[0]}
        posdey={listDepPosition[1]}
      ></ListeDepenses>
      <div id="saisie-container">
        <form className="form-container" onSubmit={handleSubmit(onSubmit)}>
          <fieldset className="fdset-saisie" {...register("banque")}>
            <div className="banque-container">
              <label className="saisie-radio">
                <input
                  value="BOURSO"
                  type="radio"
                  checked={banque === "BOURSO"}
                  onChange={modifBanque}
                ></input>
                BOURSO
              </label>
              <label className="saisie-radio">
                <input
                  value="BBVA"
                  type="radio"
                  checked={banque === "BBVA"}
                  onChange={modifBanque}
                ></input>
                BBVA
              </label>
            </div>
          </fieldset>

          <fieldset className="fdset-saisie" {...register("mode")}>
            <div className="mode-container">
              <label className="saisie-radio">
                <input
                  value="Visa"
                  type="radio"
                  name="mode"
                  id="visa"
                  checked={mode === "Visa"}
                  onChange={handleChange}
                ></input>
                Visa
              </label>

              <label className="saisie-radio">
                <input
                  value="Chq"
                  type="radio"
                  name="mode"
                  id="cheque"
                  checked={mode === "Chq"}
                  onChange={handleChange}
                ></input>
                Chèque
              </label>

              <label className="saisie-radio">
                <input
                  value="Virnt"
                  type="radio"
                  name="mode"
                  id="virnt"
                  checked={mode === "Virnt"}
                  onChange={handleChange}
                ></input>
                Virement
              </label>

              <label className="saisie-radio">
                <input
                  value="Cash"
                  type="radio"
                  name="mode"
                  id="cash"
                  checked={mode === "Cash"}
                  onChange={handleChange}
                ></input>
                Cash
              </label>
            </div>
          </fieldset>

          <div className="detail-container">
            <label className="label-saisie">
              Montant
              <input
                className="input-saisie"
                {...register("somme")}
                onChange={modifSomme}
                type="text"
                id="somme"
                // required={true}
              ></input>
            </label>

            <label className="label-saisie">
              Dépense
              <input
                className="input-saisie"
                // {...register("nature")}
                type="text"
                id="nature"
                onClick={(event) => {
                  event.preventDefault();
                  setListDepBenPosition([event.clientX, event.clientY - 200]);
                  setShowListdepbenef("depense");
                }}
              ></input>
            </label>

            <label className="label-saisie">
              Fournisseur
              <input
                className="input-saisie"
                {...register("benef")}
                type="text"
                id="benef"
                onClick={(event) => {
                  event.preventDefault();
                  setListDepBenPosition([event.clientX, event.clientY - 250]);
                  setShowListdepbenef("benef");
                }}
              ></input>
            </label>

            <label className="label-saisie">
              Note
              <input
                className="input-saisie"
                {...register("note")}
                type="text"
                id="note"
                placeholder="..."
              ></input>
            </label>
          </div>

          <div className="budget-container">
            <label className="saisie-radio">
              Budget
              <input
                {...register("menage")}
                value={"M"}
                type="checkbox"
                id="budget"
                checked={menage === true}
                onChange={modifMenage}
              ></input>
            </label>
          </div>
          <p className="date-saisie" id="d-debut">
            le{" : "} {new Date(temps).toLocaleString()}{" "}
          </p>
          <span className="btn-fin">
            {" "}
            <button type="submit" className="btn btn-last">
              Valider
            </button>
            <button onClick={annuler} className="btn btn-last">
              Annuler
            </button>
          </span>
        </form>
      </div>
    </div>
  );
}

export default Saisie;
