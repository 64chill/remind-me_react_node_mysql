import React, { Component } from 'react'
import Grid from '@material-ui/core/Grid';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
import Snackbar from '@material-ui/core/Snackbar';
import { Redirect } from 'react-router'

import PropTypes from "prop-types";
import { registerAccountSubmit } from '../../../redux/actions/emailActions';
import { connect } from 'react-redux';

class RegisterAnAccountDialog extends Component {

    // ________________________ constructor _____________________________________________________
    constructor(props){
        super(props);
        //this.props.data
        this.state = {
            open : true,
            password: "",
            pwdErr: "",
            openSnackbar : false,
            snackbarMessage : "",
            reddirectToLogin: false,
        }
    }
    // ____________________________ getDerivedStateFromProps ______________________________________
    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.loginError !== prevState.loginError && nextProps.loginError !== undefined && nextProps.loginError !== null) {
            if(nextProps.loginError !== ""){
                return ({
                    openSnackbar : true,
                    snackbarMessage: nextProps.loginError
                })
            }
        }
        if (nextProps.reddirectToLogin !== prevState.reddirectToLogin){
            return ({
                reddirectToLogin : true,
            })
        }   
    }

    // ________________________ handleClickOpen ()__________________________________________
    handleClickOpen = () =>{
        this.setState({
            open : true
        })
      }

    // ________________________ handleClose ()_____________________________________________
    handleClose = () =>{
        this.props.closeRegisterAnAccountDialog();
      }
    // ________________________ handleChange (event)________________________________________
    handleChange = event =>{
        this.setState({
            [event.target.name] : event.target.value
        })
    }
    // ________________________ handleCloseSnackbar ()________________________________________
    handleCloseSnackbar = () =>{
        this.setState({
            openSnackbar : false
        })
    }
    // ________________________ handleSubmit ()________________________________________
    handleSubmit = async () =>{
        //Check if password is valid
        let pwd_len = this.state.password.length;
        if (this.state.password === ""){
            this.setState({
                pwdErr : "Password must not be empty!"
            });
            return;
        }
        else if(!( 5 < pwd_len && pwd_len < 40) ){
            this.setState({
                pwdErr : "Password must be between 6-20 characters!"
            });
            return;
        }
        //
        const response = await fetch('/api/acc/register-existing-acc', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email : this.props.email,
                password :this.state.password,
            }),
          });
          const status_code_res = await response.status;
              if(status_code_res !== 200){
                this.setState({
                    openSnackbar : true,
                    snackbarMessage : "Register Account : ERROR , please try again later",
                })
                return;
              }
        this.setState({
            reddirectToLogin : true
        })
    }

    
    // ________________________ render _____________________________________________________
    render() {
        return (this.state.reddirectToLogin)? (<Redirect to="/login" />): (
            <>
            <Snackbar
                anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
                }}
                open={this.state.openSnackbar}
                autoHideDuration={6000}
                onClose={this.handleCloseSnackbar}
                ContentProps={{
                'aria-describedby': 'message-id',
                }}
                message={<span id="message-id">{this.state.snackbarMessage}</span>}
                action={[
                <Button key="undo" color="secondary" size="small" onClick={this.handleCloseSnackbar}>
                    Close
                </Button>
                ]}
            />

            <Dialog open={this.state.open} onClose={this.handleClose} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">
               Register the account              
            </DialogTitle>
            
            <DialogContent>
            <FormControl component="fieldset" onSubmit={this.handleSubmit} className="form-material">
            <p>
                <b> Email </b> <br></br>
                {this.props.email}
            </p>
            <TextField
                        label="Password"
                        margin="dense"
                        name="password"
                        value={this.state.password}
                        onChange={this.handleChange}
                        helperText  = {this.state.pwdErr}
                        error = {this.state.pwdErr===""?false:true}

                    /> 
            </FormControl>
            <br></br>
            <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <Button variant="contained" color="primary" onClick={this.handleSubmit}>
                            Create an account
                        </Button> 
                    </Grid>
                    <Grid item xs={2}>
                    </Grid>
                    <Grid item xs={4}>
                    <Button variant="contained" color="secondary" onClick={this.handleClose}>close</Button> 
                    </Grid>
                </Grid> 
          </DialogContent>       
            </Dialog>
            </>
        )
    }
}
// _______________________________ RegisterAnAccountDialog.propTypes _________________________________________________
RegisterAnAccountDialog.propTypes = {
    registerAccountSubmit: PropTypes.func.isRequired,
    loginError : PropTypes.string.isRequired,
    reddirectToLogin : PropTypes.bool.isRequired,
  };
  // _______________________________ mapStateToProps() ______________________________________________________
  const mapStateToProps = state =>({
    loginError: state.emailInfo.loginError,
    reddirectToLogin : state.emailInfo.reddirectToLogin,
  });
  // _______________________________ mapActionsToProps() _____________________________________________________
  const mapActionsToProps = {
    registerAccountSubmit  : registerAccountSubmit,
  }
  // _______________________________ export default() ______________________________________________________
  export default connect(mapStateToProps, mapActionsToProps)(RegisterAnAccountDialog);
