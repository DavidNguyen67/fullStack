import reactLogo from './../../assets/react.svg';
import viteLogo from '/vite.svg';
import './../../style/App.css';
import {
  decreaseCounter,
  increaseCounter,
} from '../../redux/actions/counter.action';
import { keyRootReducers, useAppDispatch, useAppSelector } from '../../redux';
import { useIntl } from 'react-intl';
import { changeLang } from '../../redux/actions/locates.action';
import { EN, AR, FR, Lang } from '../../redux/type';

function App() {
  const dispatch = useAppDispatch();
  const { value } = useAppSelector((state: keyRootReducers) => state.counter);
  const intl = useIntl();

  const languages = [EN, AR, FR];

  return (
    <>
      {languages.map((lan: Lang) => (
        <button key={lan} onClick={() => dispatch(changeLang(lan))}>
          {lan}
        </button>
      ))}
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <p>{intl.formatMessage({ id: 'app.header' })}</p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
      <button onClick={() => dispatch(increaseCounter())}>
        Increase Count
      </button>

      <button onClick={() => dispatch(decreaseCounter())}>
        Decrease Count
      </button>
      <div>Count: {value}</div>
    </>
  );
}

export default App;
