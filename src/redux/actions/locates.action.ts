import { LocateState } from '../../utils/interfaces/redux.interface';
import { CHANGE_LANGUAGE } from '../type';

export const changeLang = (payload: LocateState) => {
  return {
    type: CHANGE_LANGUAGE,
    payload: payload,
  };
};
