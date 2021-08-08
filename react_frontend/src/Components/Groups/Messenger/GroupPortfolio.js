import React, { useState } from "react";

import RealTimeChart from '../../Utils/RealTimeChart'
import Context from './Context';

function GroupPortfolio(props) {
  const [display, setDisplay] = useState('context');

  function updateDisplay(e) {
    let [action, value] = e.currentTarget.id.split("-");
    setDisplay(old => {
      let ns = {
        ...old,
        [action]: value,
      }
      return ns;
    });
  }

  function switchVisualTab(e) {
    document.querySelectorAll('.activation').forEach(el => el.classList.remove("is-active"));
    e.currentTarget.classList.add("is-active");
  }

  return (
    <div className="column is-6 hero" id="portfolio-pane" >
      <div className="tabs" id="tabs">
        <ul>
          <li className="activation is-active" onClick={switchVisualTab}>
            <a id="time-context" onClick={updateDisplay}>
              <span className="icon is-small"><i className="fas fa-comments-dollar" aria-hidden="true"></i></span>
              <span>Context</span>
            </a>
          </li>
          <li className="activation" onClick={switchVisualTab}>
            <a id="time-realtime" onClick={updateDisplay}>
              <span className="icon is-small"><i className="fas fa-chart-line" aria-hidden="true"></i></span>
              <span>Realtime</span>
            </a>
          </li>
        </ul>
      </div>

      {display.time === "realtime" ?
        <RealTimeChart display={"total"} data={props.groupData.subscribedStocks} /> :
        <Context groupData={props.groupData} />
      }
    </div>
  );
}


export default GroupPortfolio;

