import { START_LOADER } from './types';
import { STOP_LOADER } from './types';
import { IS_USER_LOGEDIN } from './types';

import { LOGIN_USER_ACTION_SUCCESS } from './types';
import { LOGIN_USER_ACTION_FAILURE } from './types';
import { SET_ERROR_DIALOG_TO_FALSE } from './types';

/************************************************************************************* */
export const checkUserSession = () => async dispatch =>{
  dispatch({type: START_LOADER,});
    const response = await fetch('/api/acc/isLogged', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      let isSession = await response.text();
      isSession = JSON.parse(isSession);

      dispatch({
        type: IS_USER_LOGEDIN,
        payload: isSession.logged
      });

      dispatch({type: STOP_LOADER,});
};
/************************************************************************************* */
export const loginUserAction = (in_email, in_password) => async dispatch =>{
  dispatch({type: START_LOADER,});

    const response = await fetch('/api/acc/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
          email:          in_email,
          password:       in_password,
      }),
    });

  const status_code_res = await response.status; 
  if( status_code_res !== 200){
      dispatch({type: LOGIN_USER_ACTION_FAILURE});
      dispatch({type: STOP_LOADER,});
      return;
  }
  dispatch({type: LOGIN_USER_ACTION_SUCCESS,});
  dispatch({type: STOP_LOADER,});
}
/************************************************************************************* */
export const setErrorAsFalse = () => async dispatch =>{
  dispatch({type:SET_ERROR_DIALOG_TO_FALSE});
}

