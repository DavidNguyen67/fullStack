import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import App from './components/app/App.tsx';
import './style/index.scss';
import { Provider } from 'react-redux';
import store from './redux/index';
import IntlContainer from './components/IntlContainer/IntlContainer.tsx';
import { BrowserRouter } from 'react-router-dom';
import FallbackComponent from './components/fallback/FallBackComponent.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Suspense fallback={<FallbackComponent />}>
      <BrowserRouter>
        <Provider store={store}>
          <IntlContainer>
            <App />
          </IntlContainer>
        </Provider>
      </BrowserRouter>
    </Suspense>
  </React.StrictMode>
);
