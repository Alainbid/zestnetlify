import React, { useCallback, useEffect, useState } from "react";
import "../styles/pointage.scss";
//import "../styles/togglebtn.scss";
import Navbarre from "../components/Navbar";
import { db } from "./Firebasefirestore";

import {
  doc,
  getDoc,
  collection,
  getDocs,
  query,
  orderBy,
  where,
  updateDoc,
} from "firebase/firestore";

const Pointage = () => {
  const [laListe, setLaListe] = useState([{}]);
  const [banque, setBanque] = useState("");
  const [letotal, setLeTotal] = useState(0.0);

  const getJournal = useCallback(async () => {
    let conditions = [];
    conditions.push(orderBy("temps", "desc"));
    if (banque != null) {
      conditions.push(where("banque", "==", banque));
    }
    conditions.push(where("pointe", "==", false));
    // conditions.push(orderBy("date", "desc"));
    let lequery = query(collection(db, "cfbjournal"), ...conditions);
    try {
      const data = await getDocs(lequery);
      //console.log("data", data.docs);
      var total = 0.00;
      data.forEach((element) => {
        total += (element.data().somme * 100);
      });
       setLeTotal (total/100);

      setLaListe(data.docs.map((ledoc) => ({ ...ledoc.data(), id: ledoc.id })));
      
    } catch (error) {
     // console.log(alert(error));
      console.log(error);

    }
  }, [banque]);

  useEffect(() => {
    getJournal();
  }, [getJournal]);

  const updatePointage = async (id) => {
    const docRef = doc(db, "cfbjournal", id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      //majour du champ pointe sur true
      await updateDoc(docRef, { pointe: true });
      // console.log("pointé", id);
      getJournal();
    } else {
      console.log("No such document!");
    }
  };

  const conformer = (vam) => {
    // console.log("vam",vam);
    if (vam === undefined) return null;
    return parseFloat(vam).toFixed(2);
  };

  const modifBanque = (e) => {
    if (e.target.id === "BOURSO" && e.target.checked) setBanque("BOURSO");
    if (e.target.id === "BBVA" && e.target.checked) setBanque("BBVA");
  };

  return (
    <div>
      <Navbarre />
      <p className="h2-pointage">Pointage d&apos;écritures </p>
      <div className="point-container">
        <label className="bourso-container">
          <input
            id="BOURSO"
            value="BOURSO"
            type="radio"
            onChange={modifBanque}
            checked={banque === "BOURSO"}
          ></input>
          BOURSO
        </label>

        <label className="bourso-container">
          <input
            id="BBVA"
            value="BBVA"
            type="radio"
            onChange={modifBanque}
            checked={banque === "BBVA"}
          ></input>
          BBVA
        </label>
      </div>

      <i className="pt-total" style={{ textJustify: "center" }}>
        Pour pointer cliquer sur la valeur de la colonne &quot;Montant&quot;
      </i>

      <div>
        <table className="tb-pointage">
          <thead className="th-pointage">
            <tr className="thr-pointage">
              <th style={{ width: 2 + "em" }}>N°</th>
              <th style={{ width: 6 + "em" }}>Banque</th>
              <th style={{ width: 11 + "em" }}>Date</th>
              <th style={{ width: 3 + "em", textAlign: "center" }}>M.</th>
              <th style={{ width: 10 + "em", textAlign: "right" }}>Montant</th>
              <th style={{ width: 1 + "em" }}></th>
              <th style={{ width: 3 + "em", textAlign: "center" }}>P.</th>
              <th style={{ width: 1 + "em" }}></th>
              <th style={{ width: 12 + "em" }}>Fournisseurs</th>
              <th style={{ width: 16 + "em" }}>Dépenses</th>
              <th style={{ width: 4 + "em" }}>Mode</th>
              <th style={{ width: 12 + "em" }}>Note</th>
            </tr>
          </thead>
          <tbody id="ligne" className="tbdy-pointage">
            {laListe.map((undoc, index) => {
              return (
                <tr id="tr-pointage" key={undoc.id}>
                  <td
                    id="td-l-point"
                    style={{ width: 2 + "em", background: "#69c88210" }}
                  >
                    {index + 1}
                  </td>
                  <td
                    id="td-l-point"
                    style={{ width: 6 + "em", background: "#69c88210" }}
                  >
                    {undoc.banque}
                  </td>
                  <td
                    id="td-l-point"
                    style={{ width: 11 + "em", background: "#69c88210" }}
                  >
                    {new Date(undoc.temps).toLocaleDateString()}
                  </td>
                  <td
                    id="td-l-point"
                    style={{ width: 2.5 + "em", background: "#69c88210" }}
                  >
                    {undoc.menage === true ? " M " : " "}{" "}
                  </td>

                  

                  <td
                    id="td-l-pointeur"
                    onClick={(e) => {
                      e.preventDefault();
                      updatePointage(undoc.id);
                    }}
                    style={{
                      width: 10 + "em",
                      textAlign: "right",
                      color: undoc.somme < 0 ? "red" : "green",
                      background: "#e9efeba6",
                      fontWeight: 500
                    }}
                  >
                    {conformer(undoc.somme)}
                  </td>
                  <td
                    id="td-l-point"
                    style={{ width: 1 + "em", background: "#69c88210" }}
                  ></td>
                  <td
                    id="td-l-point"
                    style={{
                      width: 3 + "em",
                      textAlign: "center",
                      background: "#69c88210",
                    }}
                  >
                    {undoc.pointe === false ? "?" : "P"}
                  </td>
                  <td
                    id="td-l-point"
                    style={{ width: 1 + "em", background: "#69c88210" }}
                  ></td>
                  <td
                    id="td-l-point"
                    style={{ width: 14 + "em", background: "#69c88210" }}
                  >
                    {undoc.benef}{" "}
                  </td>
                  <td
                    id="td-l-point"
                    style={{ width: 16 + "em", background: "#69c88210" }}
                  >
                    {undoc.nature}{" "}
                  </td>
                  <td
                    id="td-l-point"
                    style={{ width: 4 + "em", background: "#69c88210" }}
                  >
                    {undoc.mode}{" "}
                  </td>
                  <td
                    id="td-l-point"
                    style={{ width: 12 + "em", background: "#69c88210" }}
                  >
                    {undoc.note}
                  </td>
                </tr>
              );
            })}
            <tr>
              <td id="td-l-point" style={{ width: 2 + "em" }}></td>
              <td id="td-l-point" style={{ width: 6 + "em" }}></td>
              <td
                id="td-l-point"
                style={{
                  color: letotal < 0 ? "red" : "green",
                  width: 7 + "em",
                  textAlign: "right",
                  fontSize: "1.5rem",
                }}
              >
                TOTAL
              </td>
              <td id="td-l-point" style={{ width: 2.5 + "em" }}>
                {" "}
              </td>
              <td
                id="td-l-point"
                style={{
                  width: 12 + "em",
                  color: letotal < 0 ? "red" : "green",
                  textAlign: "right",
                  fontSize: "1.2rem",
                }}
              >
                {letotal.toFixed(2)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Pointage;
