import React from 'react';

function StockList(props) {
  return (
    <div className="column is-full" id="stock-list" >
      {props.time !== 'realtime' ? 

      <article id="stock-total" className="post" onClick={props.updateDisplay}>
        <div className="user">
          <div className="username">
            <span className="icon" style={{ marginRight: '15px' }}>
              <i className="fas fa-2x fa-chart-pie"></i>
            </span>
            <h4 className="has-text-weight-bold is-size-5">Total</h4>
          </div>
        </div>
      </article>
      : <div></div> }

      {
        props.stocks.map(stock => {
          return (
            <article key={stock.ticker} id={"stock-" + stock.ticker} className="post" onClick={props.updateDisplay}>
              <div className="user">
                <div className="username">
                  <span className="icon" style={{ marginRight: '15px' }}>
                    <i className="fas fa-2x fa-cubes"></i>
                  </span>
                  <h4 className="has-text-weight-medium is-size-5">{stock.ticker}</h4>
                </div>
                {props.time === "realtime" ? true :
                  <div>
                    {stock.performance.changeAmount < 1 ?
                      <div className="has-text-danger level icon-text stock-list-price">
                        <div className="stock-percent">
                          <i className=" fas fa-arrow-circle-down"></i>
                          <span>{stock.performance.changePercentage.toFixed(2)}</span>
                          <i className="fas fa-percent"></i>
                        </div>
                        <div className="stock-price">
                          <i className="fas fa-dollar-sign"></i>
                          <span>{stock.performance.endPrice}</span>
                        </div>
                      </div> 
                      :
                      <div className="has-text-success level icon-text stock-list-price">
                        <div className="stock-percent">
                          <i className=" fas fa-arrow-circle-up"></i>
                          <span>{stock.performance.changePercentage.toFixed(2)}</span>
                          <i className="fas fa-percent"></i>
                        </div>
                        <div className="stock-price">
                          <i className="fas fa-dollar-sign"></i>
                          <span>{stock.performance.endPrice}</span>
                        </div>
                      </div>
                    }
                  </div>
                }
              </div>
            </article>
          )
        })
      }
    </div>
  )

}

export default StockList;