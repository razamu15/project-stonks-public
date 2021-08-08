import React, { useState, useEffect } from "react";
import { useLazyQuery, gql } from '@apollo/client';

import { useMessageContext } from '../../Utils/MessageContext';
import AreaChart from '../../Utils/AreaChart'

const STOCK_DATA = gql`
  query stockData($stock: String!, $start: String!, $end: String!) {
    stock(ticker:$stock, rangeStart:$start, rangeEnd:$end){
      ticker
      data{
        startEpochTime
        closePrice
      }
      performance {
        changeAmount
	      changePercentage
      }
    }
  }
`;

function Context(props) {
  const defaultStock = props.groupData.stocksData.stocks[0].ticker;
  let [queryStockData, { loading, error, data }] = useLazyQuery(STOCK_DATA);

  const { stockContext: contextState, setStockContext: setContextState } = useMessageContext();
  const [chartData, setChartData] = useState([]);
  const [contextFocus, setContextFocus] = useState();

  function updateDisplay(e) {
    let [action, value] = e.currentTarget.id.split("-");
    setContextState(old => {
      let ns = {
        ...old,
        [action]: value,
      }
      return ns;
    });
  }

  function chartClick(elems) {
    let stck = props.groupData.stocksData.stocks.find(item => item.ticker === contextState.stock);
    // to handle chart clicks on the empty space that broke down
    if (elems[0]) {
      setContextState(old => {
        let ns = {
          ...old,
          [contextFocus]: stck.data[elems[0]._index].startEpochTime
        }
        return ns;
      });
    }

  }

  function handleContextView(e) {
    setContextState(old => {
      let ns = {
        ...old,
        mode: e.target.id,
        stock: old.stock === "total" ? defaultStock : old.stock
      }
      return ns;
    });
  }

  useEffect(() => {
    if (contextState.mode === "view") {
      // do a query here to get context data)
      queryStockData({
        variables: { stock: contextState.stock, start: `${contextState.start}`, end: `${contextState.end}` },
        fetchPolicy: "cache-first"
      });
      if (data) {
        setChartData(data.stock.data.map(bar => { return { dataPoint: bar[contextState.bar], label: new Date(bar['startEpochTime'] * 1000).toLocaleString() } }));
      }
    } else {
      if (contextState.stock === "total") {
        setChartData(props.groupData.stocksData.total.data.map(bar => { return { dataPoint: bar[contextState.bar], label: new Date(bar['startEpochTime'] * 1000).toLocaleString() } }));
      } else {
        let stck = props.groupData.stocksData.stocks.find(item => item.ticker === contextState.stock);
        setChartData(stck.data.map(bar => { return { dataPoint: bar[contextState.bar], label: new Date(bar['startEpochTime'] * 1000).toLocaleString() } }));
      }
    }
  }, [contextState, data]);

  if (loading) return <p>Loading...</p>;
  if (error) {
    console.log(error)
    return <p>Error :(</p>;
  }

  return (
    <div>
      <div className="field is-grouped is-grouped-right" style={{ margin: '0px 0px -40px 0px' }}>
        {contextState.mode === "no-context" ?
          <p className="control" style={{ marginTop: '10px' }}>
            <a id="create" className="button is-small is-info" onClick={handleContextView}>New Context</a>
          </p> :
          <p className="control" style={{ marginTop: '10px', border: 'solid #4a4a4a 0.5px' }}>
            <a id="no-context" className="button is-small is-light" onClick={handleContextView}>Clear Context</a>
          </p>}
      </div>
      <AreaChart
        precision={0.01}
        chartData={chartData}
        display={contextState.stock}
        getElementsAtEvent={chartClick}
      />

      {contextState.mode !== "view" ?
        <div className="level columns is-centered">
          {contextState.mode === "create" ?
            <div></div> :
            <div id="stock-total" onClick={updateDisplay}
              className={contextState.stock === "total" ?
                "column is-narrow stock-tile active-stock-tile has-text-weight-bold" :
                "column is-narrow stock-tile has-text-weight-bold"
              }
            >Total</div>
          }

          {props.groupData.subscribedStocks.map(elem =>
            <div
              key={elem}
              id={"stock-" + elem}
              onClick={updateDisplay}
              className={contextState.stock === elem ?
                "column is-narrow stock-tile active-stock-tile has-text-weight-bold" :
                "column is-narrow stock-tile has-text-weight-bold"
              }
            >{elem}</div>
          )}
        </div>
        : (data ?
          <div id="view">
            <div className="inline" style={{ justifyContent: 'space-between' }}>
              <p>Current Context</p>
              <span className="icon">
                <i className="fas fa-angle-down" aria-hidden="true" />
              </span>
            </div>

            <div id="change" className={data.stock.performance.changeAmount > 0 ? "card has-text-success has-background-success-light" : "card has-text-danger has-background-danger-light"} >
              <div id="change-content">
                <div className="has-text-weight-bold">
                  {data.stock.ticker} {data.stock.performance.changeAmount > 0 ? <i className=" fas fa-arrow-circle-up"></i> : <i className=" fas fa-arrow-circle-down"></i>}
                </div>
                <div>
                  <i className="fas fa-percent"></i> {data.stock.performance.changePercentage.toFixed(2)} <i className="fas fa-dollar-sign"></i> {data.stock.performance.changeAmount.toFixed(2)}
                </div>
              </div>
              <div className="has-text-left inline">
                <div className="field" style={{ margin: "0px 0px 10px 0px" }}>
                  <label className="label is-small">From</label>
                  <div className="control has-icons-left">
                    <input className="input is-small" type="text" name="start" value={new Date(contextState.start * 1000).toLocaleString()} readOnly={true} />
                    <span className="icon is-small is-left">
                      <i className="fas fa-hourglass-start"></i>
                    </span>
                  </div>
                </div>
                <div className="field" style={{ margin: "0px 0px 10px 0px" }}>
                  <label className="label is-small">To</label>
                  <div className="control has-icons-right">
                    <input className="input is-small" type="text" value={new Date(contextState.end * 1000).toLocaleString()} readOnly={true} />
                    <span className="icon is-small is-right">
                      <i className="fas fa-hourglass-end"></i>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          :
          <div></div>
        )
      }

      {contextState.mode === "create" ?
        <form className="has-text-left columns is-multiline">
          <div className="field column is-6" style={{ margin: '0px', paddingBottom: '0px' }}>
            <label className="label is-small">Start Time</label>
            <div className="control has-icons-left">
              <input className="input is-small" type="text" name="start" onFocus={e => setContextFocus(e.target.name)} value={new Date(contextState.start * 1000).toLocaleString()} />
              <span className="icon is-small is-left">
                <i className="fas fa-hourglass-start"></i>
              </span>
            </div>
          </div>
          <div className="field column is-6" style={{ margin: '0px', paddingBottom: '0px' }}>
            <label className="label is-small">End Time</label>
            <div className="control has-icons-right">
              <input className="input is-small" type="text" name="end" onFocus={e => setContextFocus(e.target.name)} value={new Date(contextState.end * 1000).toLocaleString()} />
              <span className="icon is-small is-right">
                <i className="fas fa-hourglass-end"></i>
              </span>
            </div>
          </div>
          <p className="help column is-narrow" style={{ paddingTop: '0px' }}>Highlight the input then choose the corresponding point by clicking on the chart.</p>
        </form>
        : <div></div>
      }
    </div>
  );

}


export default Context;

