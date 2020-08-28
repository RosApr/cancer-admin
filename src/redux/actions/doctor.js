import {
  FETCH_DOCTOR_LIST,
  DEL_DOCTOR,
  UPDATE_DOCTOR,
} from '@/redux/actionTypes/doctor';
import { getDoctorList } from '@/api/doctor';

export const fetchDoctorList = () => {
  return async (dispatch, getState) => {
    const doctorStore = getState().doctor;
    const isFirstFetch = doctorStore.isFirstFetch;

    const doctorListLength = doctorStore.list.length;
    if (doctorListLength > 0 || isFirstFetch) {
      return;
    }

    dispatch({
      type: FETCH_DOCTOR_LIST,
      payload: {
        isFetching: true,
        isFetchError: false,
        isFirstFetch: true,
      },
    });
    try {
      const list = await getDoctorList();
      dispatch({
        type: FETCH_DOCTOR_LIST,
        payload: {
          list,
          isFetching: false,
          isFetchError: false,
        },
      });
    } catch (e) {
      dispatch({
        type: FETCH_DOCTOR_LIST,
        payload: {
          isFetching: false,
          isFetchError: true,
        },
      });
    }
  };
};
