import React, {  useState } from "react";
import Navbar from "../components/Navbar";
import "../styles/depenses.scss";
import { useParams } from 'react-router-dom'
import { db } from "../pages/Firebasefirestore";
import Modale from "../components/Modale";
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

const SnapshotBenefs = () => {
    const { handle } = useParams()
      const [ref] = React.useState('benef')
  const [Benefs, setBenefs] = useState([]);
  const [naturebenefs, setNaturebenefs] = useState("xxx");
  const [showModal, setShowModal] = useState(false);
  const [idItem, setIdItem] = useState("");
  const [modalPosition, setModalPosition] = useState([0, 0]);
 
  // React.useEffect(() => {
  // setRef(handle);
  // }, [handle])
console.log('handle',handle);
  console.log('ref',ref);

  const benefsCollectionRef = collection(db, ref);



 

  const getBenefs = async () => {


    try{
  //  console.log('lire BD');
    const data = await getDocs(query(benefsCollectionRef, orderBy("qui")));
    setBenefs(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    //  console.log(data.docs);
    
  }catch (error){
    alert('erreur de connexion',error);
      console.log("Erreur ",error);
  }};

  const dimmer = ( (couleur) => {
    var x = document.getElementsByClassName('depense-ligne');
    var i;
    for (i = 0; i < x.length; i++) {
     x[i].style.color = couleur;
    }
 });

  //**********  MODIFIER ********** */
  const modifier = async (x) => {
    const data = { qui: "?" };
    data.qui = x;
    //console.log("x", x);
    // console.log("data nature ", data.qui, "   id  ", idItem);
    const lequel = doc(benefsCollectionRef, idItem);
    await updateDoc(lequel, data);
    getBenefs();
    dimmer("#f5deb3");
    setShowModal(false);
  };

  const supprimer = async (id) => {
    const lequel = doc(benefsCollectionRef, id);
    await deleteDoc(lequel);
    // console.log("item ", lequel);
    getBenefs();
    dimmer("#f5deb3");
    setShowModal(false);
  };

  const ajouter = async (newItem) => {
    // console.log("item ajouté  ", newItem);
    await addDoc(collection(db, "benef"), {
      qui: newItem,
    });
    getBenefs();
    dimmer("#f5deb3");
    setShowModal(false);
  };


  if ( Benefs[0] === undefined) getBenefs();


  return (
    <div>
      <Navbar></Navbar>
      {
        <Modale
          open={showModal}
          onClose={() => {setShowModal(false);
        dimmer('#f5deb3');
        }}
          posdex={modalPosition[0]}
          posdey={modalPosition[1]}
          leQuel={naturebenefs}
          onValider={(x) => {
            modifier(x);
          }}
          onAjouter={(newItem) => {
            ajouter(newItem);
          }}
          onDelete={() => {
            supprimer(idItem);
          }}
        >
          <p></p>
        </Modale>
      }

      <div className="depense-container">
        <ul className="f-li">Liste des fournisseurs</ul>

        <div className="depense-table">
         
          {Benefs.map((item, index) => {
            return (
              <ul
                className="depense-ligne"
                key={item.id}
                onClick={(event) => {
                  dimmer('#f5deb375');
                  event.preventDefault();
                  // console.log(" x ", event.clientX, "   y = ", event.clientY);
                  setModalPosition([event.clientX, event.clientY]);
                  setNaturebenefs(item.qui);
                  setIdItem(item.id);
                  setShowModal(true);
                  //document.getElementsByClassName('depense-table').style.pointerEvents ='none'
                }}
              >
                {/* pour mettre un 0 si de 1 à 9 */}
                {index < 9 ? "0" + (index + 1).toString(10) : index + 1}{" "}
                {item.qui}
              </ul>
            );
          })}
          <p></p>
        </div>
      </div>
    </div>
  );
};

export default SnapshotBenefs;
