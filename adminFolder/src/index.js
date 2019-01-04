import React from 'react';
import ReactDOM from 'react-dom';
import RouterDom from './router';
import { Provider } from 'react-redux';
import store from './redux';

const App = () => (
  <Provider store = { store }>
    <RouterDom />
  </Provider>
)

ReactDOM.render(<App />, document.getElementById('root'));

