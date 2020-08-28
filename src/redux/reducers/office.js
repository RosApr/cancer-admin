import {
  FETCH_OFFICE_LIST,
  UPDATE_OFFICE,
  initialState,
} from '@/redux/actionTypes/office';

export default function office(state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case FETCH_OFFICE_LIST:
      return { ...state, ...payload };
    case UPDATE_OFFICE:
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
    default:
      return state;
  }
}
