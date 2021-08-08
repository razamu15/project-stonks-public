import React from 'react';
import ReactDOM from 'react-dom';
import './Styles/index.css';
import { BrowserRouter as Router } from 'react-router-dom'
import App from './Components/App';
import { ProvideAuth } from './Components/Utils/Auth';

ReactDOM.render(
  <React.StrictMode>
    <ProvideAuth>
      <Router>
        <App />
      </Router>
    </ProvideAuth>
  </React.StrictMode>,
  document.getElementById('root')
);
