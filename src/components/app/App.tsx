import { BrowserRouter } from 'react-router-dom';
import Web from '../routes/Web';
import { Provider } from 'react-redux';
import store from '../../redux';
import IntlContainer from '../IntlContainer/IntlContainer';
import { Router } from 'react-router';
import { createBrowserHistory } from 'history';
import { useEffect, useState } from 'react';
import VerticalAlignTopIcon from '@mui/icons-material/VerticalAlignTop';
const history = createBrowserHistory();

function App() {
  const [showsScrollBtn, setShowScrollBtn] = useState(false);

  useEffect(() => {
    const handleButtonVisibility = () => {
      window.scrollY > 200 ? setShowScrollBtn(true) : setShowScrollBtn(false);
    };

    window.addEventListener('scroll', handleButtonVisibility);
    return () => {
      window.removeEventListener('scroll', handleButtonVisibility);
    };
  }, []);
  return (
    <>
      <BrowserRouter>
        <Router history={history}>
          <Provider store={store}>
            <IntlContainer>
              <Web />
            </IntlContainer>
          </Provider>
        </Router>
      </BrowserRouter>
      {showsScrollBtn && (
        <div
          id="scrollToTop"
          onClick={() => {
            window.scrollTo({
              top: 0,
              left: 0,
              behavior: 'smooth',
            });
          }}
          style={{
            position: 'fixed',
            bottom: '60px',
            right: '60px',
            // color: 'gray',
            textAlign: 'center',
            cursor: 'pointer',
            fontSize: '4em',
            lineHeight: 0,
            textDecoration: 'none',
          }}
        >
          <VerticalAlignTopIcon color="success" fontSize="large" />
        </div>
      )}
    </>
  );
}

export default App;
