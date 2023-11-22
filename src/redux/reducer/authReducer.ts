import { FILL_EMAIL_LOGIN, FILL_PASSWORD_LOGIN, LOGIN } from '../types/index';

const INITIAL_STATE = {
  email: '',
  password: '',
};

const authReducer = (
  state = INITIAL_STATE,
  action: { type: string; payload: string }
) => {
  switch (action.type) {
    case FILL_EMAIL_LOGIN:
      return {
        ...state,
        email: action.payload,
      };
    case FILL_PASSWORD_LOGIN:
      return {
        ...state,
        password: action.payload,
      };
    case LOGIN:
      console.log(state);
      return state;
    default:
      return state;
  }
};

export default authReducer;
