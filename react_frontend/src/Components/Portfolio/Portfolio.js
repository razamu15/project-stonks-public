import React, { useEffect, useState } from "react";
import { useLazyQuery, gql } from '@apollo/client';

import RealTimeChart from '../Utils/RealTimeChart';
import StockList from './StockList';
import AreaChart from '../Utils/AreaChart';

const STOCKS_QUERY = gql`
  query stocksQuery($userID: ID!, $time: String!, $dataPoints: Int!) {
    user(id: $userID, time: $time, dataPoints: $dataPoints){
      stocks
      stocksData { 
				total {
					data {
						startEpochTime
            closePrice
					}
				}
				stocks {
					ticker
					data {
						startEpochTime
						closePrice
					}
          performance {
            changeAmount
            changePercentage
            endPrice
          }
				}
      }
    }
  }
`;

const TIME_RANGES = {
  'realtime': { icon: 'fas fa-chart-line' },
  'week': { time: '1D', dataPoints: 7, icon: 'fas fa-calendar-minus' },
  'month': { time: '1D', dataPoints: 30, icon: 'fas fa-calendar-alt' },
  'year': { time: '1D', dataPoints: 365, icon: 'fas fa-calendar-check' }
}

function Portfolio(props) {
  const USERID = JSON.parse(localStorage.getItem("user")).userID;
  let [queryStockData, { loading, error, data }] = useLazyQuery(STOCKS_QUERY);

  const [chartData, setChartData] = useState([]);
  const [display, setDisplay] = useState({ stock: 'total', time: 'week', bar: 'closePrice', reload: true });

  // use effect will be run whenever
  useEffect(() => {
    if (!display.reload && data) {
      let result;
      if (display.stock === "total") {
        result = data.user.stocksData.total.data.map(bar => { return { dataPoint: bar[display.bar], label: new Date(bar['startEpochTime'] * 1000).toLocaleDateString() } });
      } else if (display.time === "realtime") {
        result = [];
      } else {
        let stck = data.user.stocksData.stocks.find(item => item.ticker === display.stock);
        result = stck.data.map(bar => { return { dataPoint: bar[display.bar], label: new Date(bar['startEpochTime'] * 1000).toLocaleDateString() } });
      }
      setChartData(result);
    } else if (display.reload) {
      queryStockData({
        variables: { userID: USERID, time: TIME_RANGES[display.time].time, dataPoints: TIME_RANGES[display.time].dataPoints },
        fetchPolicy: "network-only"
      });
      // after query we need to set reload to false to not run another query
      setDisplay((old) => {
        let ns = { ...old, reload: false }
        return ns
      });
    }
  }, [display, data]);


  function updateDisplay(e) {
    let [action, value] = e.currentTarget.id.split("-");
    setDisplay(old => {
      let ns = {
        ...old,
        time: (action === "time" ? value : old.time),
        stock: (action === "time" ? (value !== "realtime" ? "total" : data.user.stocks[0]) : value),
        reload: (action === "stock" || value === "realtime" ? false : true)
      }
      return ns;
    });
  }

  function switchVisualTab(e) {
    document.querySelectorAll('.activation').forEach(el => el.classList.remove("is-active"));
    e.currentTarget.classList.add("is-active");
  }

  function checkStockMarketHours() {
    let time = new Date();
    let workday = time.getDay() >= 1 && time.getDay() <= 5;
    let workingHours = time.getHours() >= 9 && time.getHours() <= 16;
    return (workingHours && workday);
  }

  if (loading) {
    return (
      <div className="container is-fluid">
        <div className="columns is-centered card" style={{ marginTop: '20px', marginLeft: '0px' }}>
          <div className="column is-7 is-centered">
            <progress className="progress is-small is-dark" max="100">15%</progress>
          </div>
        </div>
      </div>
    )
  }
  if (error) { console.log(error); return <p>Error :(</p>; }
  if (!data) return <p onClick={() => console.log(display, data)}>wait</p>


  return (
    <div className="container is-fluid">
      <div className="columns is-centered card" style={{ marginTop: '20px', marginLeft: '0px' }}>

        <div className="column is-7 is-centered">
          <div className="tabs is-boxed">
            <ul>
              {Object.entries(TIME_RANGES).map(([key, value]) => {
                return (
                  <li key={key} className={display.time === key ? "activation is-active" : "activation"} onClick={switchVisualTab}>
                    <a id={"time-" + key} onClick={updateDisplay}>
                      <span className="icon is-small"><i className={value.icon} aria-hidden="true"></i></span>
                      <span>{key.charAt(0).toUpperCase() + key.slice(1)}</span>
                    </a>
                  </li>
                )
              })}
            </ul>
          </div>

          {display.time === 'realtime' ? <RealTimeChart precision={0.15} display={display.stock} data={data.user.stocks} /> :
            <AreaChart precision={0.05} chartData={chartData} display={display.stock} />}
          <div className="has-text-left" style={{padding: '10px', display: 'flex', justifyContent: 'space-around'}} id="market-time">
            {checkStockMarketHours() ?
              <>
                <div> Stock Markets are Open</div>
                <i className="fas fa-check"></i>
              </>
            :
              <>
                <div>Stock Markets are Closed</div>
                <i className="fas fa-times"></i>
              </>
            }
          </div>
        </div>

        <div className="column columns is-multiline is-5 is-centered">
          <StockList stocks={data.user.stocksData.stocks} bar={display.bar} updateDisplay={updateDisplay} time={display.time} />
        </div>

      </div>
    </div>
  )
}

export default Portfolio;