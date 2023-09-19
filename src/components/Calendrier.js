import React, { useState, useEffect } from "react";
import "../styles/calendar.scss";


function Calendar   (dequi)  {
  const [today] = useState(() => new Date());
  const [month, setMonth] = useState(() => today.getMonth());
  const [year, setYear] = useState(() => today.getFullYear());
  const [nDays, setnDays] = useState(() =>
    new Date(year, month + 1, 0).getDate()
  );
  const [startDay, setStartDay] = useState(() =>
    new Date(year, month, 1).getDay()
  );
  const [day] = useState(() => today.getDate());

  const monthTag = [
    "Jan",
    "Fev",
    "Mar",
    "Avr",
    "Mai",
    "Jun",
    "Jul",
    "Aou",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const days = document.getElementsByTagName("td");

  useEffect(() => {
    for (let k = 0; k < 42; k++) {
      days[k].innerHTML = "";
      days[k].id = "";
      days[k].className = "";
    }
    voirCalendar(true);
    setnDays(new Date(year, month + 1, 0).getDate());
    setStartDay(new Date(year, month, 1).getDay());
    //console.log("startday", startDay);

    var n = startDay;
    for (let i = 1; i <= nDays; i++) {
      days[n].innerHTML = i.toString();
      n++;
    }
    let v = 0;
    for (let j = 0; j < 42; j++) {
      if (days[j].innerHTML === "") {
        days[j].id = "disabled";
        v++;
      } else {
        days[j].id = "today";
        let s = v - 1;
        days[day + s].id = "selected";

        days[j].addEventListener("click", () => {
        //  console.log("j-startday", j - startDay + 1);
          let ladateh = toUnixTime(year, month, j - startDay + 1,dequi.pourqui)
          dequi.sendData(ladateh);
        });
      }
    }
  }, [year, month, startDay, days, nDays, day,  dequi]);

  const voirCalendar = (open) => {
    //console.log("open",open);
    
    open
      ? (document.getElementById("calencar").style.display = "flex")
      : (document.getElementById("calencar").style.display = "none");
  };

  const preMonth = () => {
    if (month < 1) {
      setMonth(11);
      setYear(year - 1);
    } else {
      setMonth(month - 1);
    }
  };

  const nextMonth = () => {
    if (month > 12) {
      setMonth(1);
      setYear(year + 1);
    } else {
      setMonth(month + 1);
    }
  };

  //if(!open) return null;

  return (
    <div id="dbut">
      <div className="elegant-calencar" id="calencar">
        <div id="header" className="clearfix">
          <div className="pre-button0" onClick={() => preMonth()}>
            {"<"}
          </div>
          <div className="head-info">
            <div className="head-month">
              {day}
              {"-"}
              {monthTag[month]}
              {"-"}
              {year}
            </div>
          </div>
          <div className="next-button0" onClick={() => nextMonth()}>
            {">"}
          </div>
        </div>
      {/* <div> {pourqui.length} </div> */}
        <table id="calendar">
          <thead className="th-cal">
            <tr className="tr-cal">
              <th>Dim</th>
              <th>Lun</th>
              <th>Mar</th>
              <th>Mer</th>
              <th>Jeu</th>
              <th>Ven</th>
              <th>Sam</th>
            </tr>
          </thead>
          <tbody className="tb-cal">
            <tr className="tr-cal">
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
            <tr>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
            <tr>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
            <tr>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
            <tr>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
            <tr>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};



export default Calendar;

const toUnixTime = (
  year,
  month,
  day,
  pourquel
  ) => {
  let datechoisie = new Date(year, month, day).getTime(); //choisie à o heure en millis
  //console.log("datechoisie", datechoisie);
  let hoy = new Date().getTime(); //date du jour millis
  let tx = new Date().toDateString();
  let hoyoh = new Date(tx).getTime(); //date du jour à 0 heure millis

  let datechoisieHeure = datechoisie + (hoy - hoyoh);
  // console.log("datechoisieHeure", new Date(datechoisieHeure).toLocaleString());
  // console.log("datechoisieHeure", datechoisieHeure);
  // console.log("pourquel", pourquel);

  if (pourquel === "saisie") {
    return datechoisieHeure;
  } // date choisie à 0 heure en millis
  else {
    return datechoisie;
  } //date choisie avec heure exacte en millis
};
