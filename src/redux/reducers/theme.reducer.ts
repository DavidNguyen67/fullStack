import { Action } from 'redux';
// import { themeReducer } from '../../utils/interfaces/redux.interface';
import { CHANGE_THEME } from '../type';

const INITIAL_STATE = {
  isDarkTheme: false,
};

const themeReducer = (state = INITIAL_STATE, action: Action) => {
  switch (action.type) {
    case CHANGE_THEME:
      return {
        isDarkTheme: !state.isDarkTheme,
      };
    default:
      return state;
  }
};

export default themeReducer;
