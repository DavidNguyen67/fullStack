import { Dispatch } from 'redux';
import instance from '../../utils/custom/axios';
import { productsFetchAll } from '../../utils/routeApi';
import { ERROR_GENERATED_AT_HOME, FETCH_SLIDE_AT_HOME } from '../type';
import { globalRes } from '../../utils/interfaces';

export default function fetchAtHomeSlides() {
  return async (dispatch: Dispatch) => {
    function onSuccess(success: unknown) {
      dispatch({ type: FETCH_SLIDE_AT_HOME, payload: success });
      return success;
    }
    function onError(error) {
      dispatch({ type: ERROR_GENERATED_AT_HOME, payload: error });
      return error;
    }
    try {
      const success: globalRes = await instance.get(productsFetchAll);
      if (!success?.error) return onSuccess(success);
      onError(success?.error);
    } catch (error) {
      return onError(error);
    }
  };
}
