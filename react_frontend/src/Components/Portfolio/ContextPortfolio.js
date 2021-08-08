import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { useQuery, gql } from '@apollo/client';
import { useContextSocket } from '../Utils/Socket'

const STOCKS_QUERY = gql`
  query stocksQuery($userID: ID!) {
    user(id: $userID){
      stocks
    }
  }
`;

// this needs data and label fields
let CHARTS_DATA_OPTS = {
  fill: 'origin',
  lineTension: 0.1,
  backgroundColor: "rgba(75,192,192,0.6)",
  borderColor: "rgba(75,192,192,1)",
  pointRadius: 1,
  pointHitRadius: 10,
  pointBorderWidth: 1,
};

let CHARTS_OPTS = {
  scales: {
    yAxes: [
      {
        ticks: {
          // display: false,
          beginAtZero: false
        },
        gridLines: {
          display: false
        }
      }
    ],
    xAxes: [
      {
        display: true,
        ticks: {
          display: false
        },
        gridLines: {
          display: false
        },
      }
    ]
  }
};

function Portfolio(props) {
  const USERID = JSON.parse(localStorage.getItem("user")).userID;
  let { loading, error, data } = useQuery(STOCKS_QUERY, {
    variables: { userID: USERID },
    fetchPolicy: "network-only"
  });

  const [stockData, updateStockData] = useState(null);

  const [chartData, updateChartData] = useState([]);
  const [display, updateDisplay] = useState('total');

  let socket = useContextSocket();

  function a(e) {
    console.log("ubtton clicked state:", stockData);
  }

  // this use effect sets up proper formatting of the data for the chart
  useEffect(() => {
    // dont do anything untill the graphql data is here
    if (data) {
      // set the top level stock fields on the stockData state
      if (stockData === null) {
        let format = data.user.stocks.reduce((acc, curr) => (acc[curr] = [], acc), {});
        format['total'] = [];
        updateStockData(format);
      }
      // next add the handler for the stock updates on the socket
      if (socket.initialized()) {
        socket.addHandler('stock_update', (data) => {
          updateStockData(oldData => {
            let res = JSON.parse(JSON.stringify(oldData));
            let parsedData = JSON.parse(data)
            res[parsedData.stock].push(parsedData);
            res['total'].push(parsedData);
            return res;
          });
        });
      }
    }
  }, [data, socket.initialized()]);

  useEffect(() => {
    if (stockData) {
      // let res = [] //[stockData[display][0].closePrice];
      // res.concat(stockData[display].map(stck => stck.closePrice));
      let res = stockData[display].map(stck => stck.closePrice);
      // console.log(res);
      updateChartData(res);  
    }
    
  }, [stockData, display])



  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  return (
    <div className="columns">
      <div className="column is-6 is-centered">
      <button onClick={a}>PORT-hi</button>
        <Line
          data={{
            labels: Array(chartData.length).fill(''),
            datasets: [
              {
                ...CHARTS_DATA_OPTS,
                label: display,
                data: chartData,
              }
            ]
          }}
          options={CHARTS_OPTS} />
        
      </div>
    </div>
  )

}

export default Portfolio;