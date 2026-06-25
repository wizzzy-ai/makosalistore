import React from 'react';
import ReactDOM from 'react-dom';
import './App.css';
import {Provider} from 'react-redux'
import store from './store'
import App from './App';
import reportWebVitals from './reportWebVitals';

// FontAwesome configuration - Temporarily disabled
// import { library } from '@fortawesome/fontawesome-svg-core'
// import { 
//   faHome, 
//   faUsers, 
//   faChartBar, 
//   faShoppingCart, 
//   faBox, 
//   faCog,
//   faSignOutAlt,
//   faCube,
//   faSearch,
//   faBell,
//   faArrowUp,
//   faDollarSign
// } from '@fortawesome/free-solid-svg-icons'

// library.add(
//   faHome, 
//   faUsers, 
//   faChartBar, 
//   faShoppingCart, 
//   faBox, 
//   faCog,
//   faSignOutAlt,
//   faCube,
//   faSearch,
//   faBell,
//   faArrowUp,
//   faDollarSign
// )
ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
