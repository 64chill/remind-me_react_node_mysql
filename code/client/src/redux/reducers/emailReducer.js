import { CONFIRM_ACCOUNT_EMAIL  }   from '../actions/types';
import { STOP_ALL_REMINDERS     }   from '../actions/types';
import { STOP_SPECIFIC_REMINDER }   from '../actions/types';
import { EDIT_REMINDER          }   from '../actions/types';
import { SET_EMPTY_ERROR_TEXT   }   from '../actions/types';
import { GET_APPROVED_EDIT_DATA }   from '../actions/types';
import { GET_UNAPPROVED_MAXIMUM }   from '../actions/types';
import { GET_UNAPPROVED_MAXIMUM_SUCCESS } from '../actions/types';
import { UNSUBSCRIBE_ALL        }   from '../actions/types';
import { GET_EMAIL_FROM_TOKEN   } from '../actions/types';
import { GET_EMAIL_FROM_TOKEN_SUCCESS } from '../actions/types';
import { REGISTER_ACCOUNT_SUBMIT } from '../actions/types';
import { REGISTER_ACCOUNT_SUBMIT_FAILURE } from '../actions/types';
import { REGISTER_ACCOUNT_SUBMIT_SUCCESS } from '../actions/types';

import { DEFAULT_EMAIL_SUCCESS  }   from '../actions/types';
import { DFAULT_EMAIL_FAILURE   }   from '../actions/types';
import { SET_RECEIVED_DATA      }   from '../actions/types';



const initialState = {
   text : "",
   received_data : [],
   unapprovedMaxNum: -1,
   account_email: "",
   loginError : "",
   reddirectToLogin : false,
};

export default function(state = initialState, action) {
  switch (action.type) {
    case CONFIRM_ACCOUNT_EMAIL:
    case STOP_ALL_REMINDERS:
    case STOP_SPECIFIC_REMINDER:
    case EDIT_REMINDER:
    case GET_APPROVED_EDIT_DATA:
    case GET_UNAPPROVED_MAXIMUM:
    case UNSUBSCRIBE_ALL:
    case GET_EMAIL_FROM_TOKEN:
    case REGISTER_ACCOUNT_SUBMIT:
      return {
        ...state,
        text: action.payload
      };
      case DEFAULT_EMAIL_SUCCESS:
      case DFAULT_EMAIL_FAILURE:
        return {
          ...state,
          text : action.payload
        };
    case SET_EMPTY_ERROR_TEXT:
        return{
          ...state,
          text : ""
      }
    case SET_RECEIVED_DATA:
      return{
        ...state,
        received_data : action.payload,
      }
    case GET_UNAPPROVED_MAXIMUM_SUCCESS:
      return{
        ...state,
        unapprovedMaxNum : action.payload
      }
    case GET_EMAIL_FROM_TOKEN_SUCCESS:
      return{
        ...state,
        account_email: action.payload,
      }
    case REGISTER_ACCOUNT_SUBMIT_FAILURE:
      return{
        ...state,
        loginError: action.payload,
      }
    case REGISTER_ACCOUNT_SUBMIT_SUCCESS:
      return {
        ...state,
        reddirectToLogin: true,
      }
    default:
      return state;
  }
}
