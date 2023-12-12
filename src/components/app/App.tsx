import { BrowserRouter } from 'react-router-dom';
import Web from '../routes/Web';
import { Provider } from 'react-redux';
import store from '../../redux';
import IntlContainer from '../IntlContainer/IntlContainer';
import { Router } from 'react-router';
import { createBrowserHistory } from 'history';

const history = createBrowserHistory();

function App() {
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
    </>
  );
}

export default App;
