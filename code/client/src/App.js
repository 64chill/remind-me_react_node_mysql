import React,{ Component } from 'react';
import './App.css';
import LoadingOverlay from 'react-loading-overlay';
import PropTypes from "prop-types";

import { BrowserRouter, Route, Switch } from 'react-router-dom'
import  HomePage        from './components/HomePage/HomePage'
import  MyAccountPage   from './components/MyAccountPage/MyAccountPage'
import  CreatePage      from './components/CreatePage/CreatePage'
import  ErrorPage       from './components/ErrorPage'
import  LoginPage       from './components/LoginPage/LoginPage'
import  EmailConfirmAccountPage   from './components/Email/EmailConfirmAccountPage'
import  TokenEditReminderPage     from './components/Email/TokenEditReminderPage'     //for approved emails to edit
import  TokenMainEditReminderPage from './components/Email/TokenMainEditReminderPage' //for creator of reminder to edit
import  StopReminderPage          from './components/Email/StopReminderPage'
import  StopAllRemindersPage      from './components/Email/StopAllRemindersPage'

//redux
import { connect } from 'react-redux'; //redux



class App extends Component {
  // ________________________________ constructor(props) _______________________________________
  constructor(props){
    super(props);
    this.state = {
      isActiveLoader : this.props.isActiveLoader
    }
  }
  // ____________________________ getDerivedStateFromProps ______________________________________
  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.isActiveLoader !== prevState.isActiveLoader) {
        if(nextProps.isActiveLoader === true){
            return ({isActiveLoader : true})
        } else{
          return ({isActiveLoader : false})
        }
    }
  }
  // ________________________________ render() _______________________________________
  render() {
    return (
      
        <LoadingOverlay
          active={this.state.isActiveLoader}
          spinner
          text='Loading ...'
        >
          <div className="App">
            <BrowserRouter>
              <Switch>
                <Route path="/" component={HomePage} exact/>
                <Route path="/my-account" component={MyAccountPage}/>
                <Route path="/create-reminder" component= {CreatePage} />
                <Route path="/login" component= {LoginPage} />
                <Route path="/email/confirm/:token" component={EmailConfirmAccountPage}/>
                <Route path="/email/edit/reminder/:token" component={TokenEditReminderPage}/>
                <Route path="/email/reminder/edit/:token/" component={TokenMainEditReminderPage}/>
                <Route path="/email/reminder/stop/:token/" component={StopReminderPage}/> 
                <Route path="/email/reminder/stopall/:token/" component={StopAllRemindersPage}/> 
                <Route component={ErrorPage} />
                </Switch>
            </BrowserRouter>
          </div>
        </LoadingOverlay>
    );
  }
}

// _______________________________ ReduxExample.propTypes _________________________________________________
App.propTypes = {
  isActiveLoader : PropTypes.bool.isRequired,
};
// _______________________________ mapStateToProps() ______________________________________________________
const mapStateToProps = state =>({
  isActiveLoader: state.reminderInfo.isActiveLoader,
});
// _______________________________ mapActionsToProps() _____________________________________________________
const mapActionsToProps = {

}
// _______________________________ export default() ______________________________________________________
export default connect(mapStateToProps, mapActionsToProps)(App);