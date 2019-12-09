import { CONFIRM_ACCOUNT_EMAIL } from './types';
import { STOP_ALL_REMINDERS } from './types';
import { STOP_SPECIFIC_REMINDER } from './types';
import { EDIT_REMINDER } from './types';
import { GET_MAIN_EDIT_DATA } from './types';
import { GET_APPROVED_EDIT_DATA } from './types';
import { SET_EMPTY_ERROR_TEXT } from './types';
import { DEFAULT_EMAIL_SUCCESS } from './types';
import { DFAULT_EMAIL_FAILURE } from './types';
import { SET_RECEIVED_DATA } from './types';
import { GET_UNAPPROVED_MAXIMUM }   from './types';
import { GET_UNAPPROVED_MAXIMUM_SUCCESS } from './types';
import { UNSUBSCRIBE_ALL } from './types';
import { GET_EMAIL_FROM_TOKEN } from './types';
import { GET_EMAIL_FROM_TOKEN_SUCCESS } from './types';
import { REGISTER_ACCOUNT_SUBMIT } from './types';
import { REGISTER_ACCOUNT_SUBMIT_FAILURE } from './types';
import { REGISTER_ACCOUNT_SUBMIT_SUCCESS } from './types';


import { START_LOADER } from './types';
import { STOP_LOADER } from './types';




// __________________________________ confirmEmail() _________________________________________
export const confirmEmail = (in_token) => async dispatch =>{
    dispatch({
        type: CONFIRM_ACCOUNT_EMAIL,
      });
      dispatchStartLoader(dispatch);
      fetch('/api/email/confirm/account/'+in_token) 
      .then(response =>  {
        //response.status===200?confirmEmailSuccess(dispatch):confirmEmailFailure(dispatch);
        response.status===200?
        defaultEmailSuccess("Success! Your email is now verified!",dispatch):
        defaulEmailFailure("There was a problem processing this token!",dispatch);
      })
};

const dispatchStartLoader = (dispatch)=>{
  dispatch({
    type: START_LOADER,
  });
}
const dispatchStopLoader = (dispatch)=>{
  dispatch({
    type: STOP_LOADER,
  });
}

const defaultEmailSuccess = (payloadText, dispatch)=>{
  dispatch({
    type: DEFAULT_EMAIL_SUCCESS,
    payload: payloadText,
  });
  dispatchStopLoader(dispatch);
}
const defaulEmailFailure = (payloadText, dispatch) =>{
  
  dispatch({
    type: DFAULT_EMAIL_FAILURE,
    payload: payloadText,
  });
  dispatchStopLoader(dispatch);
}
/* ******************************************************************************************** */
/* ******************************************************************************************** */
/* ******************************************************************************************** */
/* ******************************************************************************************** */


// __________________________________ stopAllReminders() _________________________________________
export const stopAllReminders = (in_token) => async dispatch =>{
  dispatch({
      type: STOP_ALL_REMINDERS,
    });
    dispatchStartLoader(dispatch);
    const response = await fetch('/api/reminder/unsubscribe-all', {
      method: 'POST',
      headers: {
      'Content-Type': 'application/json',
      },
      body: JSON.stringify({
          token : in_token,
      }),
    });
    const status_code_res = await response.status;
    response.status===200?
        defaultEmailSuccess("Unsubscribe : Success!",dispatch):
        defaulEmailFailure("Ops there was a problem to unsubscribe at the moment, please try later!",dispatch);
};

/* ******************************************************************************************** */
/* ******************************************************************************************** */
/* ******************************************************************************************** */
/* ******************************************************************************************** */


// __________________________________ stopSpecificReminder() _________________________________________
export const stopSpecificReminder = (in_token) => async dispatch =>{
  dispatch({
      type: STOP_SPECIFIC_REMINDER,
    });
    dispatchStartLoader(dispatch);
    const response = await fetch('/api/reminder/unsubscribe-specific-reminder', {
      method: 'POST',
      headers: {
      'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token : in_token
    }),
    });
    const status_code_res = await response.status;
    response.status===200?
        defaultEmailSuccess("Reminder disabled.",dispatch):
        defaulEmailFailure("Ops there was a problem to unsubscribe at the moment, please try later!",dispatch);
};

/* ******************************************************************************************** */
/* ******************************************************************************************** */
/* ******************************************************************************************** */
/* ******************************************************************************************** */
// TokenEditReminderPage.js

// __________________________________ editReminder() _________________________________________
export const editReminder = (in_token, in_data, received_data_approved) => async dispatch =>{
  dispatch({
      type: EDIT_REMINDER,
    });
    dispatchStartLoader(dispatch);
    const post_res = await fetch('/api/reminder/is-token-expired', {
      method: 'POST',
      headers: {
      'Content-Type': 'application/json',
      },
      body: JSON.stringify({
          token : in_token,
      }),
    });
    const statusCode = await post_res.status;
    if(statusCode !== 200){
      defaulEmailFailure("Edit token has expired, you do not have the premission to edit! Please REGISTER to be able to do so!",dispatch)
      return;
    }
    ////
    if(in_token && in_data.approved !== received_data_approved && in_data.approved === "disabled" ){
      const res1 = await fetch('/api/reminder/is-unapproved-reminders-max-reached-nonregistered', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            token : in_token,
        }),
      });
      const statuscode1 = await res1.status;
      if(statuscode1 !== 200){
        let rTXT= await res1.statusText;
        defaulEmailFailure(rTXT,dispatch)
        return;
      }
      let reData = await res1.text();
      if (reData){ // max_reached
        defaulEmailFailure(`Max number of unapproved requests is reached! 
        You don't have the premission to set this reminder as unapproved,
        please singup to be able to do that!`,dispatch);
          return;
      }
    }
    ////
    in_data.approved === "approved"?in_data.approved=1:in_data.approved=0;
    //contact the server to SAVE the changes
    const res2 = await fetch('/api/reminder/edit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
          title			: in_data.title,
          text			: in_data.text,
          approved		: in_data.approved,
          next_date		: in_data.next_date,
          remind_by		: in_data.remind_by,
          every			: in_data.every,
          time			: in_data.time,
          day_difference  : in_data.day_difference,
          id_reminder 	: in_data.id,
          id_user         : in_data.id_user
       }),
    });
    const statuscode2 = await res2.status;
    if(statuscode2 === 200){
      defaultEmailSuccess("Reminder was edited",dispatch);
      return
    }
    defaulEmailFailure(`Edit Reminder Failed, please try again later!`,dispatch);
};

/**************************************************************************************** */
// __________________________________ getMainEditData() _________________________________________
export const getMainEditData = (in_token) => async dispatch =>{
  dispatch({
    type: GET_MAIN_EDIT_DATA,
  });
  dispatchStartLoader(dispatch);
  const response = await fetch('/api/reminder/post-reminder-edit', {
    method: 'POST',
    headers: {
    'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        token : in_token,
    }),
  });
  
  const status_code_res = await response.status;
  if(status_code_res !== 200){
    defaulEmailFailure("There was a problem with this token! Please try later if you are sure it is a valid one!",dispatch);
    return;
  }
  let reData = await response.text();
  //this.received_data = JSON.parse(reData) ;
  setReceivedData(JSON.parse(reData), dispatch);
  //this.setStateReceivedData();
};

// __________________________________ getApprovedEditData() _________________________________________
export const getApprovedEditData = (in_token) => async dispatch =>{
  dispatch({
    type: GET_APPROVED_EDIT_DATA,
  });
  //TODO CHECK/REWRITE ADOPT TO WORK HERE
  await fetch("/api/reminder/get-reminder-edit-token/" + in_token)
  .then(response => 
      response.json()
  )
      .then(data => {
          if (typeof data[0] !== 'undefined'){
            setReceivedData(data, dispatch);
          } else {
            defaulEmailFailure("There was some error, please try again and check if your token is valid, is it correct",dispatch);
          }
      });
};

/* ******************************************************************************************** */
/* ******************************************************************************************** */
/* ******************************************************************************************** */
/* ******************************************************************************************** */
// TokenMainEditReminderPage.js
export const getUnapprovedMax  = () => async dispatch =>{
  dispatch({
    type: GET_UNAPPROVED_MAXIMUM,
  });
  dispatchStartLoader(dispatch);
  const response = await fetch('/api/reminder/get-unapproved-maxnum', {
    method: 'POST',
    headers: {
    'Content-Type': 'application/json',
    },
  });
  const status_code_res = await response.status;
      if(status_code_res !== 200){
        let rTXT= await response.statusText;
        defaulEmailFailure("",dispatch);
        return;
      }

  let reData = await response.text();
  reData = JSON.parse(reData);
  dispatch({
    type: GET_UNAPPROVED_MAXIMUM_SUCCESS,
    payload: reData[0].maxnum
  });
  dispatchStopLoader(dispatch);
};
/**************************************************************************************** */
export const unsubscribeAll  = (in_token) => async dispatch =>{
  dispatch({
    type: UNSUBSCRIBE_ALL,
  });
  dispatchStartLoader(dispatch);
  const response = await fetch('/api/reminder/unsubscribe-all', {
    method: 'POST',
    headers: {
    'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        token : in_token,
    }),
  });
  response.status===200?
        defaultEmailSuccess("Unsubscribe : Success!",dispatch):
        defaulEmailFailure("Ops there was a problem to unsubscribe atm, please try later!",dispatch);
}

/* ******************************************************************************************** */
/* ******************************************************************************************** */
/* ******************************************************************************************** */
/* ******************************************************************************************** */
// EmailReminderComponent.js
export const getEmailFromToken  = (in_token) => async dispatch =>{
  dispatch({
    type: GET_EMAIL_FROM_TOKEN,
  });
  dispatchStartLoader(dispatch);
  const response = await fetch('/api/acc/get-email-from-token', {
    method: 'POST',
    headers: {
    'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        token : in_token,
    }),
  });
  const status_code_res = await response.status;
      if(status_code_res !== 200){
        let rTXT= await response.statusText;
        defaulEmailFailure(rTXT,dispatch)
        return;
      }

  let reData = await response.text();
  reData = JSON.parse(reData);

  dispatch({
    type: GET_EMAIL_FROM_TOKEN_SUCCESS,
    payload: reData[0].user_email
  });
  dispatchStopLoader(dispatch);
}


/* ******************************************************************************************** */
/* ******************************************************************************************** */
/* ******************************************************************************************** */
/* ******************************************************************************************** */
// RegisterAnAccountDialog.js
export const registerAccountSubmit  = (in_email,in_password) => async dispatch =>{
  dispatch({
    type: REGISTER_ACCOUNT_SUBMIT,
  });
  dispatchStartLoader(dispatch);

  const response = await fetch('/api/acc/register-existing-acc', {
    method: 'POST',
    headers: {
    'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email     : in_email,
      password  : in_password,
    }),
  });
  const status_code_res = await response.status;
      if(status_code_res !== 200){
        dispatch({
          type: REGISTER_ACCOUNT_SUBMIT_FAILURE,
          payload: "Register Account : ERROR , please try again later"
        });
        dispatchStopLoader(dispatch);
      }
  dispatch({
    type: REGISTER_ACCOUNT_SUBMIT_SUCCESS,
  });
  dispatchStopLoader(dispatch);
}



// __________________________________ setEmptyText() _________________________________________
export const setEmptyText = () => async dispatch =>{
  dispatch({
      type: SET_EMPTY_ERROR_TEXT,
    });
    return;
}

// __________________________________ setReceivedData() _________________________________________
const setReceivedData = (new_data_list , dispatch) =>{
  dispatch({
      type: SET_RECEIVED_DATA,
      payload: new_data_list
    });
    dispatchStopLoader(dispatch);
    return;
}



