import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './components/app/App.tsx';
import './style/index.css';
import { Provider } from 'react-redux';
import store from './redux/index';
import IntlContainer from './components/IntlContainer/IntlContainer.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <IntlContainer>
        <App />
      </IntlContainer>
    </Provider>
  </React.StrictMode>
);
