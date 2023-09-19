import React, { useEffect, useState, useRef, useCallback } from "react";
import "../styles/recherche.scss";
import Navbarre from "../components/Navbar";
import { db } from "../pages/Firebasefirestore";
import Calendar from "../components/Calendrier";
import Modif from "../components/Modif.tsx";

import {
  collection,
  getDocs,
  query,
  orderBy,
  limit,
  where,
  endAt,
  startAt,
} from "firebase/firestore";

const Recherche = () => {
  const [laListe, setLaListe] = useState([{}]);
  const [banque, setBanque] = useState("");
  const [pointe, setPointe] = useState(false);
  const [nonpointe, setnonPointe] = useState(false);
  const [menage, setMenage] = useState(false);
  const [somme, setSomme] = useState(0);
  const [letotal, setLetotal] = useState(0);
  const [note, setNote] = useState("");
  const [nature, setNature] = useState("");
  const [benef, setBenef] = useState("");
  //const [fin] = useState(new Date("2050/12/30").getTime());
  const [fin] = useState(2555580680000);
  const [showCalendar, setShowCalendar] = useState(false);
  const checkBou = useRef();
  const checkBva = useRef();
  const checkPointe = useRef();
  const checknonPointe = useRef();
  const checkMenage = useRef();
  const [modifLequel, setModifLequel] = useState("x");
  const [showNavbar, setShowNavbar] = useState(true);

  /************* getJournal ********** */
  const getJournal = useCallback(async () => {
    let dat0 = document.getElementById("d-debut").value;
    dat0 = dat0.split("/");
    let dat1 = new Date(
      parseInt(dat0[2], 10),
      parseInt(dat0[1], 10) - 1,
      parseInt(dat0[0], 10)
    ).getTime();

    let conditions = [];
    if (banque !== "all") conditions.push(where("banque", "==", banque));

    if (pointe && !nonpointe) {
      conditions.push(where("pointe", "==", true));
    }

    if (nonpointe && !pointe) {
      conditions.push(where("pointe", "==", false));
    }

    if (menage) {
      conditions.push(where("menage", "==", true));
      console.log("63", menage);
    }

    if (somme !== 0) conditions.push(where("somme", "==", parseFloat(somme)));

    if (note !== "") conditions.push(where("note", "==", note));

    if (nature !== "") conditions.push(where("nature", "==", nature));

    if (benef !== "") conditions.push(where("benef", "==", benef));

    conditions.push(orderBy("temps", "desc"));
    // console.log("debut de getjournal", debut);
    conditions.push(endAt(dat1));
    conditions.push(startAt(fin)); //31/12/2050
    conditions.push(limit(100));

    //************  QUERY ******************************/

    let lequery = query(collection(db, "cfbjournal"), ...conditions);
    try {
      var total = 0.0;
      const data = await getDocs(lequery);
      data.forEach((element) => {
        total += element.data().somme * 100;
      });
      setLetotal(total / 100);

      setLaListe(
        data.docs.map((ledoc, index) => ({ ...ledoc.data(), id: ledoc.id }))
      );

      // console.log("nombre de data", data.docs.length);
    } catch (error) {
      alert("Erreur du query ", error);
      console.log("Erreur du query ", error);
    }
  }, [banque, benef, fin, pointe, nonpointe, menage, nature, somme, note]);

  //******************USEEFFECT ***************************/

  useEffect(() => {
    getJournal();
    letotal === 0 //evite d'afficher la table vide
      ? (document.getElementById("tbch-pointage").style.display = "none")
      : (document.getElementById("tbch-pointage").style.display = "flex");
  }, [getJournal, note, letotal]);

  const modifBanque = () => {
    let bso = checkBou.current.checked;
    let bva = checkBva.current.checked;
    if (bso && !bva) {
      setBanque("BOURSO");
    } else if (!bso && bva) {
      setBanque("BBVA");
    } else !bso && !bva ? setBanque("X") : setBanque("all");
  };

  const depuisLe = () => {
    setShowNavbar(false);
    setShowCalendar(true);
    document.getElementById("depuis-container").style.display = "none";
  };

  const modifMenage = (e) => {
    e.target.checked ? setMenage(true) : setMenage(false);
    console.log("menage ds modif", menage);
  };

  const modifPointe = (e) => {
    e.target.checked ? setPointe(true) : setPointe(false);
  };

  const modifnonPointe = (e) => {
    e.target.checked ? setnonPointe(true) : setnonPointe(false);
  };

  const modifSomme = (e) => {
    //console.log("e", e.target.value);
    e.target.value === 0 ? setSomme(0) : setSomme(e.target.value);
  };

  const modifNote = (e) => {
    e.target.value === "" ? setNote("") : setNote(e.target.value);
  };

  const modifDepense = (e) => {
    e.target.value === "" ? setNature("") : setNature(e.target.value);
  };

  const modifBenef = (e) => {
    e.target.value === "" ? setBenef("") : setBenef(e.target.value);
  };

  const getData = (datechoisieheure) => {
    // console.log("datechoisieheure  reche", datechoisieheure);

    document.getElementById("d-debut").value = new Date(
      datechoisieheure
    ).toLocaleDateString();
    document.getElementById("annule").style.display = "flex";
    document.getElementById("recherche-cont").style.display = "flex";
    document.getElementById("thr-Recherche").style.display = "revert";
    setShowCalendar(false);
  };

  //****************************************************** */
  return (
    <div>
      {showNavbar && <Navbarre id="navbar"></Navbarre>}

      <div className="div-span">
        <span className="span-annule">
          <ul className="h2-Recherche">
            Recherche d&apos;écritures
            <button
              className="annule"
              id="annule"
              onClick={() => {
                document.getElementById("recherche-cont").style.visibility =
                  "hidden";
                document.getElementById("tbch-pointage").style.visibility =
                  "hidden";
                window.location.reload();
              }}
            >
              Annuler
            </button>
          </ul>
        </span>
      </div>
      <div id="depuis-container">
        <label>
          Rechercher depuis quelle date
          <button
            onClick={() => {
              depuisLe();
            }}
          >
            {" "}
            ?
          </button>
        </label>
      </div>

      {showCalendar && (
        <Calendar id="calencar" sendData={getData} pourqui="recherche" />
      )}

      <Modif
        openModif={modifLequel}
        onCloseModif={async () => {
          setModifLequel("x");
          console.log("location", window.location.href);
          let x = window.location.href;
          await getJournal();
          document.getElementById("recherche-cont").style.display = "none";
          setTimeout(function () {
            window.location.href = x;
          }, 3000);
        }}
      ></Modif>

      <div id="recherche-cont">
        <div id="bsbbva">
          <label className="bourso-container">
            <input
              id="BOURSO"
              value="BOURSO"
              type="checkbox"
              ref={checkBou}
              onChange={modifBanque}
            ></input>
            BOURSO
          </label>

          <label className="bourso-container">
            <input
              id="BBVA"
              value="BBVA"
              type="checkbox"
              ref={checkBva}
              onChange={modifBanque}
            ></input>
            BBVA
          </label>

          <label className="bourso-container">
            <input
              value={"M"}
              type="checkbox"
              ref={checkMenage}
              onChange={modifMenage}
            ></input>
            Budget
          </label>

          <label className="bourso-container">
            <input
              value={"M"}
              type="checkbox"
              ref={checkPointe}
              id="pointe"
              onChange={modifPointe}
            ></input>
            Pointé
          </label>
          <label className="bourso-container">
            <input
              value={"M"}
              type="checkbox"
              ref={checknonPointe}
              id="nonpointe"
              onChange={modifnonPointe}
            ></input>
            non-Pointé
          </label>
        </div>

        <form className="recherche-form">
          <label className="label-saisie">
            Montant{" "}
            <input
              className="input-recherche"
              type="number"
              id="somme"
              onChange={modifSomme}
            ></input>
          </label>

          <label className="label-saisie">
            Depense{" "}
            <input
              className="input-recherche"
              type="text"
              id="depense"
              onChange={modifDepense}
            ></input>
          </label>

          <label className="label-saisie">
            Fournisseur{" "}
            <input
              className="input-recherche"
              type="text"
              id="benefs"
              onChange={modifBenef}
            ></input>
          </label>

          <label className="label-saisie">
            Note{" "}
            <input
              className="input-recherche"
              type="text"
              id="note"
              onChange={modifNote}
            ></input>
          </label>

          <label className="label-saisie">
            Date début{" "}
            <input className="input-recherche" type="text" id="d-debut"></input>
          </label>
        </form>
      </div>

      <div id="tbch-pointage">
        <div id="dbl-clic">Pour éditer cliquer sur la valeur à modifier</div>
        <table className="tbc-pointage">
          <thead className="th-Recherche">
            <tr id="thr-Recherche">
              <th style={{ width: 2 + "em" }}>N°</th>
              <th style={{ width: 6 + "em" }}>Banque</th>
              <th style={{ width: 11 + "em" }}>Date</th>
              <th style={{ width: 3 + "em", textAlign: "center" }}>M.</th>
              <th
                style={{
                  width: 10 + "em",
                  textAlign: "right",
                  color: letotal < 0 ? "red" : "green",
                }}
              >
                <i
                  className="r-total"
                  style={{ color: letotal < 0 ? "red" : "green" }}
                >
                  total {letotal.toFixed(2)}
                </i>
              </th>
              <th style={{ width: 1 + "em" }}></th>
              <th style={{ width: 3 + "em", textAlign: "center" }}>P.</th>
              <th style={{ width: 1 + "em" }}></th>
              <th style={{ width: 12 + "em" }}>Fournisseurs</th>
              <th style={{ width: 16 + "em" }}>Dépenses</th>
              <th style={{ width: 4 + "em" }}>Mode</th>
              <th style={{ width: 12 + "em" }}>Note</th>
            </tr>
          </thead>
          <tbody id="ligne">
            {laListe.map((undoc, index) => {
              return (
                <tr
                  onClick={(event) => {
                    event.preventDefault();
                    document.getElementById("recherche-cont").style.display =
                      "none";
                    setModifLequel(undoc.id);
                  }}
                  className="tr-ligne"
                  key={undoc.id}
                >
                  <td style={{ width: 2 + "em" }}>{index + 1}</td>
                  <td style={{ width: 6 + "em" }}>{undoc.banque}</td>
                  <td style={{ width: 11 + "em" }}>
                    {new Date(undoc.temps).toLocaleDateString()}
                  </td>

                  <td style={{ width: 3 + "em" }}>
                    {undoc.menage === true ? "M" : " "}
                  </td>
                  <td
                    style={{
                      width: 10 + "em",
                      color: undoc.somme < 0 ? "red" : "green",
                      textAlign: "right",
                    }}
                  >
                    {parseFloat(undoc.somme).toFixed(2)}
                  </td>
                  <td style={{ width: 1 + "em" }}></td>
                  <td style={{ width: 3 + "em" }}>
                    {undoc.pointe === true ? "P" : "."}
                  </td>
                  <td style={{ width: 1 + "em" }}></td>
                  <td style={{ width: 12 + "em" }}>{undoc.benef} </td>
                  <td style={{ width: 16 + "em" }}>{undoc.nature} </td>
                  <td style={{ width: 4 + "em" }}>{undoc.mode} </td>
                  <td style={{ width: 12 + "em" }}>{undoc.note}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Recherche;
