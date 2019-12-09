import { combineReducers }  from 'redux';
import userReducer          from './userReducer';
import reminderReducer      from './reminderReducer';
import emailReducer         from './emailReducer';
import myAccountPageReducer from './myAccountPageReducer';

export default combineReducers({
    //here we are combining reducers that can be found in this folder
    //main idea is to have every reducer separated by each file
  userinfo        : userReducer,
  reminderInfo    : reminderReducer,
  emailInfo       : emailReducer,
  myAccountInfo   : myAccountPageReducer,
});
