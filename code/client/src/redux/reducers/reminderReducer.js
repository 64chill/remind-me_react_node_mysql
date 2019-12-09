import { CREATE_REMINDER } from '../actions/types';
import { CREATE_REMINDER_SUCCESS } from '../actions/types';
import { CREATE_REMINDER_FAILURE } from '../actions/types';
import { SET_EMPTY_SNACKBAR_TEXT } from '../actions/types';
import { START_LOADER } from '../actions/types';
import { STOP_LOADER } from '../actions/types';

const initialState = {
   isActiveLoader: false,
   snackbarText : ""
};

export default function(state = initialState, action) {
  switch (action.type) {
    case CREATE_REMINDER:
      return {
        ...state,
        isActiveLoader: true,
      };
    case CREATE_REMINDER_SUCCESS:
    case CREATE_REMINDER_FAILURE:
        return {
          ...state,
          isActiveLoader: false,
          snackbarText : action.payload
        };
    case SET_EMPTY_SNACKBAR_TEXT :
        return{
            ...state,
            snackbarText : ""
        }
    case START_LOADER:
        return {
          ...state,
          isActiveLoader: true,
        };
    case STOP_LOADER:
        return {
          ...state,
          isActiveLoader: false,
        };
    default:
      return state;
  }
}
