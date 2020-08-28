import {
  FETCH_SERVICE_LIST,
  UPDATE_SERVICE,
  initialState,
} from '@/redux/actionTypes/service';

export default function service(state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case FETCH_SERVICE_LIST:
      return { ...state, ...payload };
    case UPDATE_SERVICE:
      const updatedSerivceIndex = state.list.findIndex(
        ({ id }) => id === payload.id,
      );
      if (updatedSerivceIndex >= 0) {
        const _list = [...state.list];
        _list.splice(updatedSerivceIndex, 1, payload);
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
