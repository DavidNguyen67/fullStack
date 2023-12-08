import { EN, FR, AR } from '../type';
import { Action, LocateState } from '../../utils/interfaces/redux.interface';
import English from './../../lang/en.json';
import Arabic from './../../lang/ar.json';
import French from './../../lang/fr.json';

const INITIAL_STATE: LocateState = {
  lang: English,
  locale: 'en',
};

const locatesReducer = (state = INITIAL_STATE, action: Action) => {
  switch (action.type) {
    case EN:
      return {
        lang: English,
        locale: EN,
      };

    case FR:
      return {
        lang: French,
        locale: FR,
      };

    case AR:
      return {
        lang: Arabic,
        locale: AR,
      };

    default:
      return state;
  }
};

export default locatesReducer;
