import { FILL_EMAIL_LOGIN, FILL_PASSWORD_LOGIN, LOGIN } from '../types';

export const fillEmailLogin = (payload: string): object => {
  return {
    type: FILL_EMAIL_LOGIN,
    payload,
  };
};

export const fillPasswordLogin = (payload: string): object => {
  return {
    type: FILL_PASSWORD_LOGIN,
    payload,
  };
};

export const login = (): object => {
  return {
    type: LOGIN,
  };
};
