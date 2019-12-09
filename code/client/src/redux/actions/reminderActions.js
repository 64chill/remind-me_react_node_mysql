import { CREATE_REMINDER } from './types';
import { CREATE_REMINDER_SUCCESS } from './types';
import { CREATE_REMINDER_FAILURE } from './types';
import { SET_EMPTY_SNACKBAR_TEXT } from './types';

// __________________________________ createReminderTask() _________________________________________
export const createReminderTask = (in_data) => async dispatch =>{
    dispatch({
        type: CREATE_REMINDER,
      });
    let rTXT;
    if (in_data.password=== ""){
        const res1 = await fetch('/api/reminder/is-unapproved-reminders-max-reached-nonregistered', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email : in_data.email,
            }),
          });
          const statuscode1 = await res1.status;
          if(statuscode1 !== 200){
            createReminderFailure(dispatch,"");
            return;
          }
          let reData = await res1.text();
          if (reData==="true"){ // max_reached
            createReminderFailure(dispatch,`Max number of unapproved requests is reached! 
            You don't have the premission to set this reminder as unapproved,
            please singup to be able to do that!`);
              return;
          }
    }
    //////////////////////////////////////////////////////////////////////////////////
        //check if need to create an account?
        //then create an account
        //later send the data to the server to write remindme to the database
        if(in_data.singup && in_data.password!= ""){
            const response_register = await fetch('/api/acc/register', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email       :in_data.email,
                    password    :in_data.password,
                 }),
              });
              const status_code_res_reg = await response_register.status;
              if(status_code_res_reg!==200){
                createReminderFailure(dispatch,"");
                  return;
              }
        }
        // Finally create our reminder
        const response = await fetch('/api/reminder/create', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email       :in_data.email,
                password    :in_data.password,
                remind_by   :in_data.remind_me_by,
                title_reminder :in_data.title_reminder,
                every       :in_data.every    ,
                start_date  : in_data.dateToPost,
                time        :in_data.time,
                reminder_text: in_data.saying,
                day_difference_between_reminders:in_data.every_data_dayDifference,
                nextDate : in_data.nextDate,
             }),
          });

          const status_code_res = await response.status;
          if( status_code_res !== 200){
              if (status_code_res == 401){
                createReminderFailure(dispatch,"Authentification Failed");
                return;
              }
            createReminderFailure(dispatch,"");
            return;
            }
        createReminderSuccess(dispatch);    
};


const createReminderSuccess = (dispatch) =>{
    dispatch({
        type: CREATE_REMINDER_SUCCESS,
        payload: "Created Reminder!",
      });
    return CREATE_REMINDER_SUCCESS
} 

const createReminderFailure = (dispatch, text_toShow) =>{
    if(text_toShow === ""){
        text_toShow = `ERROR Occured!`;
    }
    dispatch({
        type: CREATE_REMINDER_FAILURE,
        payload: text_toShow,
      });
    return CREATE_REMINDER_FAILURE
} 
// __________________________________ setDefaultSnackBarTextState() _________________________________________
export const setDefaultSnackBarTextState = () => async dispatch =>{
    dispatch({
        type: SET_EMPTY_SNACKBAR_TEXT,
      });
      return;
}
