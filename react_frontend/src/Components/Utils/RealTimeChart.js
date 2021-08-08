import React, { useEffect, useState } from "react";
import { useSocket } from './Socket'
import AreaChart from './AreaChart';

function RealTimeChart(props) {
  const [stockData, updateStockData] = useState(null);
  const [chartData, updateChartData] = useState([]);

  let { initialized, addHandler, emitMessage } = useSocket("/stocks");

  // this use effect sets up proper formatting of the data for the chart
  useEffect(() => {
    // dont do anything untill the graphql data is here
    if (props.data) {
      // set the top level stock fields on the stockData state
      if (stockData === null) {
        let format = props.data.reduce((acc, curr) => (acc[curr] = [], acc), {});
        format['total'] = [];
        updateStockData(format);
      }
      // check that the socket connection has been established then perform actions needed
      if (initialized()) {
        // add the handler for the stock updates on the socket, so we are listening for any stock update events
        addHandler('stock_update', (data) => {
          updateStockData(oldData => {
            let res = JSON.parse(JSON.stringify(oldData));
            let parsedData = JSON.parse(data)
            res[parsedData.stock].push(parsedData);
            res['total'].push(parsedData);
            return res;
          });
        });
        // now we send the message to the server for the stocks which we want to listen for.
        // ow itll be like saying to the server above that yes we are listening for the stock update event
        // but there are stock update events for millions of stocks, below we say which of those millions of
        // stock we are interested in
        emitMessage("subscribe", props.data);
      }
    }
  }, [initialized()]);

  useEffect(() => {
    if (stockData) {
      let res = stockData[props.display].map(stck => {
        return {
          dataPoint: stck.closePrice, 
          label: new Date(stck['endEpochTime'] * 1000).toLocaleDateString()
        }
      });
      // FIX THE TOTAL THINGS
      updateChartData(res);
    }
  }, [stockData, props.display])

  return (
    <AreaChart precision={props.precision} chartData={chartData} display={props.display} />
  )
}

export default RealTimeChart;