import React from "react";
import { Switch, Route, useRouteMatch } from 'react-router-dom';
import { ApolloClient, ApolloProvider, createHttpLink, InMemoryCache } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

import Navbar from './Navbar';
import Account from './Account/Account';
import Groups from './Groups/Groups';
import Portfolio from "./Portfolio/Portfolio";
import Leaderboard from "./Leaderboard/Leaderboard";
import Cards from './Posts/Cards';
// import ContextPortfolio from "./Portfolio/ContextPortfolio";
// import { ProvideSocket } from './Utils/Socket'


const httpLink = createHttpLink({
  uri: '/graphql',
});

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = localStorage.getItem('authToken');
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    }
  }
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache()
});

function Home(props) {
  let { path, url } = useRouteMatch();
  // const [prices, updatePrices] = useState([]);
  // let { initialized, addHandler, emitMessage } = useSocket("http://localhost:8000");

  // function a(e) {
  //   emitMessage('msg', {title: "this my object", other:3})
  //   console.log("ubtton clicked state:", prices);
  // }

  // useEffect(() => {
  //   addHandler('stock_update', (data) => {
  //     updatePrices(prices => [...prices, JSON.parse(data)]);
  //   });
  // }, [initialized()]);

  return (
    <ApolloProvider client={client}>
      <div>
        <Navbar />
        {/* <ProvideSocket uri="http://localhost:8000"> */}
        <Switch>
          <Route exact path={path}>
            <Portfolio />
          </Route>
          <Route path={`${path}/account`}>
            <Account />
          </Route>
          <Route path={`${path}/cards`}>
            <Cards />
          </Route>
          <Route path={`${path}/groups`}>
            <Groups />
          </Route>
          <Route path={`${path}/leaderboard`}>
            <Leaderboard />
          </Route>
        </Switch>
        {/* </ProvideSocket> */}
      </div>
    </ApolloProvider>
  );
}

export default Home;

