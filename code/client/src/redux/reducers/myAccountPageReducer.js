import { GET_SPECIFIC_USER_DATA_SUCCESS } from '../actions/types';
import { GET_SPECIFIC_USER_DATA_FAILURE } from '../actions/types';
import { SET_NEW_APPROVED_EMAIL_SUCCESS } from '../actions/types';
import { SET_NEW_APPROVED_EMAIL_FAILURE } from '../actions/types';
import { REMOVE_APPROVED_EMAIL_SUCCESS } from '../actions/types';
import { REMOVE_APPROVED_EMAIL_FAILURE } from '../actions/types';
import { GET_APPROVED_EMAIL_LIST_SUCCESS } from '../actions/types';
import { GET_SPECIFIC_USER_REMINDER_DATA_SUCCESS } from '../actions/types';
import { CHANGE_REMINDER_FULL_LIST } from '../actions/types';



const initialState = {
    reminders_list : [],
    reminders_list_full_list : [],
    textErrDialogApprovedEmail : "",
    approved_email_reset_state : false,
    removed_approved_email_id: -1,
    snackbar_text : "",
    approved_email_list : [],
};

export default function(state = initialState, action) {
  switch (action.type) {     
    case GET_SPECIFIC_USER_DATA_SUCCESS:
        return {
            ...state,
            reminders_list : action.payload
        };
    case GET_SPECIFIC_USER_DATA_FAILURE:
    case SET_NEW_APPROVED_EMAIL_FAILURE:
        return{
            ...state,
            textErrDialogApprovedEmail : action.payload
        }
    case SET_NEW_APPROVED_EMAIL_SUCCESS:
        return{
            ...state,
            approved_email_reset_state: true,
        }
    case REMOVE_APPROVED_EMAIL_SUCCESS:
            return{
                ...state,
                removed_approved_email_id: action.payload,
            }
    case REMOVE_APPROVED_EMAIL_FAILURE:
            return{
                ...state,
                snackbar_text: action.payload,
            }
    case GET_APPROVED_EMAIL_LIST_SUCCESS:
        return{
            ...state,
            approved_email_list : action.payload
        }
    case GET_SPECIFIC_USER_REMINDER_DATA_SUCCESS:
        return {
            ...state,
            reminders_list_full_list : action.payload
        }
    case CHANGE_REMINDER_FULL_LIST:
        return{
            ...state,
            reminders_list_full_list: action.payload
        }
    default:
      return state;
  }
}
