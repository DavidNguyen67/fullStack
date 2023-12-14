import { Dispatch } from 'redux';
import instance from '../../utils/custom/axios';
import { EventsFetchAll } from '../../utils/routeApi';
import { ERROR_GENERATED, FETCH_SLIDE } from '../type';
import { globalRes } from '../../utils/interfaces';

export default function fetchSlides() {
  return async (dispatch: Dispatch) => {
    function onSuccess(success: unknown) {
      dispatch({ type: FETCH_SLIDE, payload: success });
      return success;
    }
    function onError(error) {
      dispatch({ type: ERROR_GENERATED, payload: error });
      return error;
    }
    try {
      const success: globalRes = await instance.get(EventsFetchAll);
      if (!success?.error) return onSuccess(success);
      onError(success?.error);
    } catch (error) {
      return onError(error);
    }
  };
}
