import { combineReducers } from 'redux';
import authReducer from './reducer/authReducer';
import CRUD_Reducers from './reducer/CRUD_Reducers';

const reducers = combineReducers({
  auth: authReducer,
  CRUD_Reducers,
});

export default reducers;
