import React, { Component } from 'react'
import ErrorDialogComponent from '../../CreatePage/create_page_components/ErrorDialogComponent'

import Grid from '@material-ui/core/Grid';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

import PropTypes from "prop-types";
import { getSpecificUserData, setNewEmailToEditSpecificReminder } from '../../../redux/actions/myAccountPageActions';
import { connect } from 'react-redux';

class AddNewApprovedEditEmail extends Component {
    // ________________________ constructor _____________________________________________________
    constructor(props){
        super(props);
        this.state = {
            open : false,
            reminders_list : [],
            inputEditEmail : "",
            inputIDReminder : "",
            inputEditEmailErr : "",
            inputReminderErr : "",
            openErrDialog : false,
            dataErrDialog : "",
            onAddNewEmail : false
        }
    }
    // ____________________________ getDerivedStateFromProps ______________________________________
    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.reminders_list !== prevState.reminders_list) {
            if(nextProps.reminders_list !== ""){
                return ({reminders_list : nextProps.reminders_list,
                    inputIDReminder : nextProps.reminders_list.id_reminder})
            }
        }
    if (nextProps.textErrDialogApprovedEmail !== prevState.textErrDialogApprovedEmail && nextProps.textErrDialogApprovedEmail !== "") {
        return{
            openErrDialog : true,
            dataErrDialog : nextProps.textErrDialogApprovedEmail
        }
    }

    if (nextProps.approved_email_reset_state !== prevState.approved_email_reset_state) {
        if(nextProps.approved_email_reset_state === true){
            return{
                open : false,
                reminders_list : [],
                inputEditEmail : "",
                inputIDReminder : "",
                inputEditEmailErr : "",
                inputReminderErr : "",
                openErrDialog : false,
                dataErrDialog : "",
                onAddNewEmail : true,
            }
        }
    }
    }

    // _______________________________ componentDidMount _____________________________
    async componentDidMount(){
        //fetch list of reminders for a specific user
        this.props.getSpecificUserData();
        } 

        // ________________________ handleErrorDialogClose ()________________________________________
        handleErrorDialogClose = () =>{
            this.setState({
                "openErrDialog" : false
            })
        }
        

    // ________________________ handleClickOpen ()__________________________________________
    handleClickOpen = () =>{
        this.setState({
            open : true
        })
      }

    // ________________________ handleClose ()_____________________________________________
    handleClose = () =>{
        this.setState({
            open : false,
        })
      }

    // ________________________ handleChange (event)________________________________________
    handleChange = event =>{
        this.setState({
            [event.target.name] : event.target.value
        })
    }
     // ________________________ handleSubmit (event)________________________________________
     handleSubmit = async event =>{
         //todo have this this.props.onAddNewEmail();
        event.preventDefault();
        const IsInputValid = this.validateInput();
 
         if(!IsInputValid){
             return;
         }
         this.props.setNewEmailToEditSpecificReminder(this.state.inputEditEmail, this.state.inputIDReminder);
     }
    // ________________________ handleAddedEmail() ________________________________________
     handleAddedEmail = () =>{
        this.props.onAddNewEmail();
        this.setState({
            onAddNewEmail: false
        })
     }

    // ________________________ validateInput (event)________________________________________
    validateInput = () =>{
        let errL = [];
        const emailVerify = /[^@]+@[^\.]+\..+/;

        if (this.state.inputEditEmail === ""){errL["inputEditEmailErr"]   = "Email must not be empty!";}
        else if (!emailVerify.test(this.state.inputEditEmail))
                {errL["inputEditEmailErr"] = "Email is not valid! Correct Format is : example@example.com";}

        //todo validate if empty ID reminder
        if ( this.state.inputIDReminder === "" || this.state.inputIDReminder === undefined || this.state.inputIDReminder == null){
            errL["inputReminderErr"] = "Reminder must not be empty"
        }
        if (Object.keys(errL).length > 0){ //check if our object is empty
            this.setState({
                "inputEditEmailErr" :errL.inputEditEmailErr  === undefined? "" : errL.inputEditEmailErr ,
                "inputReminderErr"  :errL.inputReminderErr   === undefined? "" : errL.inputReminderErr ,
            })
            return false;
        }
        return true;
    }


    // ________________________ render _____________________________________________________
    render() {
        let menuItemsReminders = null;
        if(this.state.reminders_list !== []){
            menuItemsReminders=this.state.reminders_list.map(reminder => (
                <MenuItem value={reminder.id_reminder}>{reminder.title}</MenuItem>
            ));
        }
        
        return (
            <>
            {this.state.onAddNewEmail?this.handleAddedEmail():null}
            {this.state.openErrDialog?
                <ErrorDialogComponent
                    closeErrorDialog={this.handleErrorDialogClose}
                    data={this.state.dataErrDialog}>
                </ErrorDialogComponent> 
                : null}

            <Button variant="outlined" color="primary" onClick={this.handleClickOpen}>
                                ADD new
                            </Button>

            <Dialog open={this.state.open} onClose={this.handleClose} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">
                Approve new email to change reminder
            </DialogTitle>
            <DialogContent>
            <FormControl component="fieldset" onSubmit={this.handleSubmit} className="form-material">
                <TextField
                    label="Email"
                    margin="dense"
                    name="inputEditEmail"
                    value={this.state.inputEditEmail}
                    onChange={this.handleChange}
                    helperText  = {this.state.inputEditEmailErr}
                    error = {this.state.inputEditEmailErr===""?false:true}
                />
                <p> Choose which reminder can particular email edit.</p>
                <Select
                name="inputIDReminder"
                value={this.state.inputIDReminder}
                onChange={this.handleChange}
                >
                    {menuItemsReminders}
                </Select>
                   
            </FormControl>

            </DialogContent> 
            <DialogActions>
                <Grid container spacing={2}>
                <Grid item xs={6}>
                <Button variant="contained" color="primary" onClick={this.handleSubmit}>
                    Add email
                </Button>  
                </Grid>
                    <Grid item xs={6}>
                        <Button variant="contained" color="secondary" onClick={this.handleClose}>Cancel</Button>
                    </Grid>
                </Grid>   
          </DialogActions>
            </Dialog>
            </>
        )
    }
}

// _______________________________ AddNewApprovedEditEmail.propTypes _________________________________________________
AddNewApprovedEditEmail.propTypes = {
    getSpecificUserData: PropTypes.func.isRequired,
    setNewEmailToEditSpecificReminder: PropTypes.func.isRequired,
    reminders_list : PropTypes.array.isRequired,
    textErrDialogApprovedEmail : PropTypes.string.isRequired,
    approved_email_reset_state : PropTypes.bool.isRequired,  };
  // _______________________________ mapStateToProps() ______________________________________________________
  const mapStateToProps = state =>({
    reminders_list: state.myAccountInfo.reminders_list,
    textErrDialogApprovedEmail: state.myAccountInfo.textErrDialogApprovedEmail,
    approved_email_reset_state: state.myAccountInfo.approved_email_reset_state,
  });
  // _______________________________ mapActionsToProps() _____________________________________________________
  const mapActionsToProps = {
    getSpecificUserData  : getSpecificUserData,
    setNewEmailToEditSpecificReminder : setNewEmailToEditSpecificReminder,
  }
  // _______________________________ export default() ______________________________________________________
  export default connect(mapStateToProps, mapActionsToProps)(AddNewApprovedEditEmail);