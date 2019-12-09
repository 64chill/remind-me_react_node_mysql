import { START_LOADER } from './types';
import { STOP_LOADER }  from './types';
import { GET_SPECIFIC_USER_DATA_SUCCESS } from './types';
import { GET_SPECIFIC_USER_DATA_FAILURE } from './types';
import { SET_NEW_APPROVED_EMAIL_SUCCESS } from './types';
import { SET_NEW_APPROVED_EMAIL_FAILURE } from './types';
import { REMOVE_APPROVED_EMAIL_SUCCESS } from './types';
import { REMOVE_APPROVED_EMAIL_FAILURE } from './types';
import { GET_APPROVED_EMAIL_LIST_SUCCESS } from './types';
import { GET_SPECIFIC_USER_REMINDER_DATA_SUCCESS } from './types';
import { CHANGE_REMINDER_FULL_LIST } from './types';






/********************************************************************************* */
//AddNewApprovedEditEmail.js
// __________________________________ getSpecificUserData() _________________________________________
export const getSpecificUserData = () => async dispatch =>{
    dispatch({type: START_LOADER,});
    const response = await fetch('/api/reminder/gatall-specific-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if(response.status===200){
        let reData = await response.text();
        reData = JSON.parse(reData);
        dispatch({
          type: GET_SPECIFIC_USER_DATA_SUCCESS,
          payload: reData
        });
        dispatch({type: STOP_LOADER,});
      } else {
        dispatch({
            type: GET_SPECIFIC_USER_DATA_FAILURE,
            payload: "There was a problem trying to proccess your request from the server!"
          });
      }
}
// __________________________________ setNewEmailToEditSpecificReminder() _________________________________________
export const setNewEmailToEditSpecificReminder = (in_email, in_reminderid) => async dispatch =>{
    dispatch({type: START_LOADER,});
    const response = await fetch('/api/reminder/add-new-approve-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            email      : in_email,
            reminderid : in_reminderid,
         }),
      });
      const status_code_res = await response.status;
      if( status_code_res !== 200){
          dispatch({type: SET_NEW_APPROVED_EMAIL_FAILURE, payload: response.statusText});
          dispatch({type: STOP_LOADER,});
        return;
      } else{
        dispatch({type: SET_NEW_APPROVED_EMAIL_SUCCESS,});
        dispatch({type: STOP_LOADER,});
      }
}
/******************************************************************************************* */
//AllowedEditEmailsComponent
// __________________________________ removeApprovedEmail() _________________________________________
export const removeApprovedEmail = (in_id_to_remove) => async dispatch =>{
  dispatch({type: START_LOADER,});
  const response = await fetch('/api/reminder/remove-approved-email', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        delID: in_id_to_remove,
     }),
  });
  const status_code_res = await response.status;
  if( status_code_res !== 200){
    dispatch({type: STOP_LOADER,});
    dispatch({
      type: REMOVE_APPROVED_EMAIL_FAILURE,
      payload: "Ops, there was a problem trying to remove this email, please try again later!"
      });
      return;
    }
    dispatch({type: REMOVE_APPROVED_EMAIL_SUCCESS, payload: in_id_to_remove});
    dispatch({type: STOP_LOADER,});
}
// __________________________________ removeApprovedEmail() _________________________________________
export const getApprovedEmailList = (in_id_to_remove) => async dispatch =>{
  dispatch({type: START_LOADER,});
    const response = await fetch('/api/reminder/list-approved-emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    let reData = await response.text();
    const status_code_res = await response.status;
    if( status_code_res !== 200){
      dispatch({
        type: REMOVE_APPROVED_EMAIL_FAILURE,
        payload: "Problem while trying to get data about emails...",
        });
        dispatch({type: STOP_LOADER,});
        return;
      }
      dispatch({
        type: GET_APPROVED_EMAIL_LIST_SUCCESS,
        payload: JSON.parse(reData),
        });
      dispatch({type: STOP_LOADER,});
}
/******************************************************************************************* */
//DetailsComponent
// __________________________________ removeApprovedEmail() _________________________________________
export const editReminderSave = (in_object) => async dispatch =>{
  dispatch({type: START_LOADER,});
  const response = await fetch('/api/reminder/edit', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        title			: in_object.title,
        text			: in_object.text,
        approved		: in_object.approved,
        next_date		: in_object.next_date,
        remind_by		: in_object.remind_by,
        every			: in_object.every,
        time			: in_object.time,
        day_difference  : in_object.day_difference,
        id_reminder 	: in_object.id_reminder,
     }),
  });
  dispatch({type: STOP_LOADER,});
}
/******************************************************************************************* */
//ReminderTableListComponent
//
//
// __________________________________ switchApproveReminder() _________________________________________
export const switchApproveReminder = (in_id_reminder, in_reminder_status) => async dispatch =>{
  dispatch({type: START_LOADER,});
  const response = await fetch('/api/reminder/approve', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        id_reminder	: in_id_reminder,
        approve 		: in_reminder_status
     }),
  });
  const status_code_res = await response.status;
  if( status_code_res !== 200){
      dispatch({
        type: REMOVE_APPROVED_EMAIL_FAILURE,
        payload: "Ops, there was a problem trying to edit this reminder, please try again later!"
    });
  }
  dispatch({type: STOP_LOADER,});
}

// __________________________________ switchApproveReminder() _________________________________________
export const removeReminder = (in_reminderToRemoveID) => async dispatch =>{
  dispatch({type: START_LOADER,});
  const response = await fetch('/api/reminder/remove-reminder', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        id_reminder			: in_reminderToRemoveID,
     }),
  });
  const status_code_res = await response.status;
  if( status_code_res !== 200){
    dispatch({
      type: REMOVE_APPROVED_EMAIL_FAILURE,
      payload: "Ops, there was a problem trying to remove this reminder, please try again later!"
    });
  }
  dispatch({type: STOP_LOADER,});
}
// __________________________________ switchApproveReminder() _________________________________________
export const getReminderDataForSpecificUser = (in_id_reminder, in_reminder_status) => async dispatch =>{
  dispatch({type: START_LOADER,});
  const response = await fetch('/api/reminder/gatall-specific-user', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  let reData = await response.text();
  reData = JSON.parse(reData);
  dispatch({
    type: GET_SPECIFIC_USER_REMINDER_DATA_SUCCESS,
    payload: reData
  })
  dispatch({type: STOP_LOADER,});
}
// __________________________________ changeReminderListFullList(newList) _________________________________________
export const changeReminderListFullList = (newList) => async dispatch =>{
  dispatch({
    type: CHANGE_REMINDER_FULL_LIST,
    payload: newList
  })
}