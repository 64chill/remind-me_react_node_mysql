import { IS_USER_LOGEDIN } from '../actions/types';
import { LOGIN_USER_ACTION_SUCCESS } from '../actions/types';
import { LOGIN_USER_ACTION_FAILURE } from '../actions/types';
import { SET_ERROR_DIALOG_TO_FALSE } from '../actions/types';


const initialState = {
  sessionActive: false,
  openErrorDialog : false
};

export default function(state = initialState, action) {
  switch (action.type) {
    case IS_USER_LOGEDIN:
      return {
        ...state,
        sessionActive: action.payload
      };
    case LOGIN_USER_ACTION_SUCCESS:
      return{
        ...state,
        sessionActive: true,
      }
    case LOGIN_USER_ACTION_FAILURE:
      return{
        ...state,
        openErrorDialog: true,
      }
    case SET_ERROR_DIALOG_TO_FALSE:
        return{
          ...state,
          openErrorDialog: false,
        }
    default:
      return state;
  }
}
