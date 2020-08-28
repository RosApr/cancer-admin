import {
  FETCH_SERVICE_LIST,
  UPDATE_SERVICE,
} from '@/redux/actionTypes/service';
import { getServices } from '@/api/service';

export const fetchServiceList = () => {
  return async (dispatch, getState) => {
    const serviceStore = getState().service;
    const isFirstFetch = serviceStore.isFirstFetch;

    const serviceListLength = serviceStore.list.length;
    if (serviceListLength > 0 || isFirstFetch) {
      return;
    }

    dispatch({
      type: FETCH_SERVICE_LIST,
      payload: {
        isFetching: true,
        isFetchError: false,
        isFirstFetch: true,
      },
    });
    try {
      const list = await getServices();
      dispatch({
        type: FETCH_SERVICE_LIST,
        payload: {
          list,
          isFetching: false,
          isFetchError: false,
        },
      });
    } catch (e) {
      dispatch({
        type: FETCH_SERVICE_LIST,
        payload: {
          isFetching: false,
          isFetchError: true,
        },
      });
    }
  };
};
