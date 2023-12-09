import { CHANGE_LANGUAGE, EN, FR, VN } from '../type';
import {
  ChangeLanAction,
  LocateState,
} from '../../utils/interfaces/redux.interface';
import English from './../../lang/en.json';
import Vietnamese from './../../lang/vn.json';
import French from './../../lang/fr.json';

const INITIAL_STATE: LocateState = {
  locale: EN,
  lang: English,
};

const locatesReducer = (state = INITIAL_STATE, action: ChangeLanAction) => {
  let lang = null;
  switch (action.type) {
    case CHANGE_LANGUAGE:
      action.payload === VN && (lang = Vietnamese);
      action.payload === EN && (lang = English);
      action.payload === FR && (lang = French);

      return {
        ...state,
        lang: lang,
        locale: action.payload,
      };

    default:
      return state;
  }
};

export default locatesReducer;
