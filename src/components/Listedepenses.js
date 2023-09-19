import React , { useState, useEffect, useCallback }from 'react';
import "../styles/listedepenses.scss";
import PropTypes from "prop-types";
import { db } from "../pages/Firebasefirestore";
import {
  collection,
  getDocs,
  query,
  orderBy,
} from "firebase/firestore";

const ListeDepenses = (props) => {
  const [liste, setListe] = useState([]);
  const getDepBenef =  useCallback( async () => {
    if (props.open === 'benef') {
      const data = await getDocs(query(collection(db, "benef"), orderBy("qui")));
    setListe(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));

    }
    else {  const data = await getDocs(query(collection(db, "depenses"), orderBy("nature")));
    setListe(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    }
    // console.log("liste",liste);
  },[props.open]);

  useEffect(() => {
   getDepBenef();
  }, [getDepBenef]);


   if(props.open === '')   return null;
  
  return (
    <div>
      <div
        className="listdep-container"
        style={{ left: props.posdex + "px", top: props.posdey + "px" }}
      >

        <div className="listdep-table">
          
          {
            liste.map((item, index) => {
             return(
              <ul
                className="listdep-ligne"
                key={item.id}
                onClick={(event) => {
                  var x = ''
                  event.preventDefault();
                  props.open === 'benef' ?  x =item.qui : x = item.nature
                  props.onValider(x,props.open);
                  props.onClose();
                }}
              >
                {/* pour mettre un 0 si de 1 à 9 */}
                {index < 9 ? "0" + (index + 1).toString(10) : index + 1}{" "}
                {props.open === 'benef' ? item.qui : item.nature}
              </ul>
             );
            })
          }
        </div>
        </div>
      </div>
    
  );
}

ListeDepenses.propTypes = {
  posdex: PropTypes.number,
  posdey: PropTypes.number,
  open: PropTypes.string,
  onClose: PropTypes.func,
  onValider:PropTypes.func,
  
};

export default ListeDepenses;