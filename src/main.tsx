import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
// import App from './components/app/App.tsx';
import './style/index.scss';
import FallbackComponent from './components/fallback/FallBackComponent.tsx';
export const App = React.lazy(() => import('./components/app/App.tsx'));

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Suspense fallback={<FallbackComponent />}>
      <App />
    </Suspense>
  </React.StrictMode>
);
