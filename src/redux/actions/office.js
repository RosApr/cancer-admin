import { FETCH_OFFICE_LIST } from '@/redux/actionTypes/office';
import { getOffices } from '@/api/office';

export const fetchOfficeList = () => {
  return async (dispatch, getState) => {
    const officeStore = getState().office;
    const isFirstFetch = officeStore.isFirstFetch;

    const officeListLength = officeStore.list.length;
    if (officeListLength > 0 || isFirstFetch) {
      return;
    }

    dispatch({
      type: FETCH_OFFICE_LIST,
      payload: {
        isFetching: true,
        isFetchError: false,
        isFirstFetch: true,
      },
    });
    try {
      const list = await getOffices();
      dispatch({
        type: FETCH_OFFICE_LIST,
        payload: {
          list,
          isFetching: false,
          isFetchError: false,
        },
      });
    } catch (e) {
      dispatch({
        type: FETCH_OFFICE_LIST,
        payload: {
          isFetching: false,
          isFetchError: true,
        },
      });
    }
  };
};
