import {
  FETCH_DOCTOR_LIST,
  DEL_DOCTOR,
  UPDATE_DOCTOR,
  initialState,
} from '@/redux/actionTypes/doctor';

export default function doctor(state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case FETCH_DOCTOR_LIST:
      return { ...state, ...payload };
    case DEL_DOCTOR:
      const { id: delId, ...rest } = payload;
      return {
        ...state,
        ...rest,
        ...(delId !== undefined
          ? { list: state.list.filter(({ id }) => id !== delId) }
          : null),
      };
    case UPDATE_DOCTOR:
      const updatedOfficeIndex = state.list.findIndex(
        ({ id }) => id === payload.id,
      );
      if (updatedOfficeIndex >= 0) {
        const _list = [...state.list];
        _list.splice(updatedOfficeIndex, 1, payload);
        return {
          ...state,
          list: _list,
        };
      }
      return state;
      return;
    default:
      return state;
  }
}
