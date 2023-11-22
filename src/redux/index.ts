import { combineReducers } from 'redux';
import counterReducer from './reducer/counterReducer';
import authReducer from './reducer/authReducer';

const reducers = combineReducers({
  counter: counterReducer,
  auth: authReducer,
});

export default reducers;
