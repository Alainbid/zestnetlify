import React from "react";
import { useState } from "react";
import { db } from "./Firebasefirestore";
import Modale from "../components/Modale.jsx";
import "../styles/depenses.scss";
import Navbar from "../components/Navbar";
import {
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  collection,
  getDocs,
  query,
  orderBy,
} from "firebase/firestore";




const Depenses = () => {
  
  const [Depenses, setDepenses] = useState([]);
 const depensesCollectionRef = collection(db, "depenses");
  const [natureDepenses, setNatureDepenses] = useState("xxx");
  const [showModal, setShowModal] = useState(false);
  const [idItem, setIdItem] = useState("");
  const [modalPosition, setModalPosition] = useState([0, 0]);

  const getDepenses = async () => {
    try {
      // console.log('lire BD');
      const data = await getDocs(
        query(depensesCollectionRef, orderBy("nature"))
      );
      setDepenses(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    } catch (error) {
      alert("erreur de connexion", error);
      console.log("Erreur ", error);
    }
  };

  //**********  MODIFIER ********** */
  const modifier = async (x) => {
    const data = { nature: "?" };
    data.nature = x;
    //  console.log("data nature ", data.nature, "   id  ", idItem);
    const lequel = doc(depensesCollectionRef, idItem);
    await updateDoc(lequel, data);
    getDepenses();
    dimmer("#f5deb3");
    setShowModal(false);
  };

  const supprimer = async (id) => {
    const lequel = doc(depensesCollectionRef, id);
    await deleteDoc(lequel);
    // console.log("item ", lequel);
    getDepenses();
    dimmer("#f5deb3");
    setShowModal(false);
  };

  const ajouter = async (newItem) => {
    // console.log("item ajouté  ", newItem);
    await addDoc(collection(db, "depenses"), {
      nature: newItem,
    });
    getDepenses();
    dimmer("#f5deb3");
    setShowModal(false);
  };

  
  const dimmer = (couleur) => {
    var x = document.getElementsByClassName("depense-ligne");
    var i;
    for (i = 0; i < x.length; i++) {
      x[i].style.color = couleur;
    }
  };

  //pour actualiser la table au début
  if (Depenses[0] === undefined) getDepenses();

  return (
    <div>
      <Navbar></Navbar>

      <Modale
        open={showModal}
        onClose={() => {
          setShowModal(false);
          dimmer("#f5deb3");
        }}
        posdex={modalPosition[0]}
        posdey={modalPosition[1]}
        leQuel={natureDepenses}
        onValider={(x) => {
          modifier(x);
        }}
        onAjouter={(newItem) => {
          ajouter(newItem);
        }}
        onDelete={() => {
          supprimer(idItem);
        }}
      ></Modale>

      <div className="depense-container">
        <ul className="f-li">Types de dépenses</ul>

        <div className="depense-table">
          {Depenses.map((item, index) => {
            return (
              <ul
                className="depense-ligne"
                key={item.id}
                onClick={(event) => {
                  dimmer("#f5deb385");

                  event.preventDefault();
                  // console.log(" x ", event.clientX, "   y = ", event.clientY);
                  setModalPosition([event.clientX, event.clientY]);
                  setNatureDepenses(item.nature);
                  setIdItem(item.id);
                  setShowModal(true);
                  // console.log("natureBenefs =", { natureDepenses });
                  // console.log("itmId =", { idItem });
                }}
              >
                {/* pour mettre un 0 si de 1 à 9 */}
                {index < 9 ? "0" + (index + 1).toString(10) : index + 1}{" "}
                {item.nature}
              </ul>
            );
          })}
          <p></p>
        </div>
      </div>
    </div>
  );
};

export default Depenses;
