import React, { Component } from 'react'

import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import PropTypes from "prop-types";
import { Redirect } from 'react-router'

//redux
import { connect } from 'react-redux'; //redux
import { checkUserSession, loginUserAction, setErrorAsFalse } from '../../redux/actions/userActions';


const initState = { //set initial state for input fields
    lEmail:     "",
    lPwd:  "",
    emailError:"",
    pwdError:"",
    openErrorDialog : false,
    reddirectToMyAccountPage: false,
}

class LoginPage extends Component {
    // _________________________________________________________________________________
    constructor(props){
        super(props);
        this.state = initState;
    }

    // ____________________________________________________
    async onUpdateSessionActive(){
        this.props.checkUserSession();
    }

    // _________________________________________________________________________________
    validateInput = () =>{
        let emailError = "";
        let pwdError = "";

        const emailVerify = /[^@]+@[^\.]+\..+/;
        const pwd_len = this.state.lPwd.length;


        if (this.state.lEmail === "")                   {emailError   = "Email must not be empty!";}
        else if (!emailVerify.test(this.state.lEmail))  {emailError = "Email is not valid! Correct Format is : example@example.com";}

        if (this.state.lPwd === "") {pwdError  = "Password must not be empty!";}
        else if(!( 3 < pwd_len) )   {pwdError = "Password must longer than 4 characters!";}


        if(emailError !== "" || pwdError!== "" ){
            this.setState({                  //if there are errors add those errors to the state
                "emailError" : emailError ,
                "pwdError" : pwdError
            });
            return false;
        }
        return true;
    }
    // _________________________________________________________________________________
    handleSubmit = async event =>{
        event.preventDefault();
        const IsInputValid = this.validateInput();
        if (!IsInputValid){return;}
        this.props.loginUserAction(this.state.lEmail,this.state.lPwd);
    }
    // _________________________________________________________________________________
    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.sessionActive !== prevState.sessionActive) {
            if(nextProps.sessionActive === true){
                return ({reddirectToMyAccountPage : true})
            }
        }

        if (nextProps.openErrorDialog !== prevState.openErrorDialog) {
                return ({openErrorDialog : nextProps.openErrorDialog})
        }
      }

    // _________________________________________________________________________________
    handleChange = event =>{
        this.setState({
            [event.target.name] : event.target.value
        })
    }

    // _________________________________________________________________________________
    render() {
        return (this.state.reddirectToMyAccountPage)? (<Redirect to="/my-account" />):
         (
            <div>
                <FormControl component="fieldset" onSubmit={this.handleSubmit} className="form-material">
                <TextField
                    type="email"
                    label="Email"
                    name="lEmail"
                    value={this.state.lEmail}
                    onChange={this.handleChange}
                    helperText  = {this.state.emailError}
                    error       = {this.state.emailError===""?false:true}
                 />
                <br></br>
                <TextField
                    label="Password"
                    type="password"
                    name="lPwd"
                    value={this.state.lPwd}
                    onChange={this.handleChange}
                    helperText  = {this.state.pwdError}
                    error       = {this.state.pwdError===""?false:true}
                />
                <br></br>
                <Button variant="contained" color="primary" onClick={this.handleSubmit}>
                    Login
                </Button>
                </FormControl>

                <Dialog
                    open={this.state.openErrorDialog}
                    onClose={() => this.setState({openErrorDialog : false})}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">{"Ops there was a problem!"}</DialogTitle>
                    <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Email and password are incorrect or user with that email does not exist!
                    </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                    <Button onClick={() => this.props.setErrorAsFalse()} color="primary">
                        Close
                    </Button>
                    </DialogActions>
                </Dialog>
            </div>
        )
    }
}

// _______________________________ ReduxExample.propTypes _________________________________________________
LoginPage.propTypes = {
    checkUserSession: PropTypes.func.isRequired,
    setErrorAsFalse: PropTypes.func.isRequired,
    loginUserAction: PropTypes.func.isRequired,
    sessionActive: PropTypes.bool.isRequired,
    openErrorDialog: PropTypes.bool.isRequired
  };
  // _______________________________ mapStateToProps() ______________________________________________________
  const mapStateToProps = state =>({
    sessionActive: state.userinfo.sessionActive,
    openErrorDialog : state.userinfo.openErrorDialog,
  });
  // _______________________________ mapActionsToProps() _____________________________________________________
  const mapActionsToProps = {
    checkUserSession  : checkUserSession,
    setErrorAsFalse   : setErrorAsFalse,
    loginUserAction   : loginUserAction
  }
  // _______________________________ export default() ______________________________________________________
  export default connect(mapStateToProps, mapActionsToProps)(LoginPage);
