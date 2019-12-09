import React, { Component } from 'react'
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormLabel from '@material-ui/core/FormLabel';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import DateFnsUtils from '@date-io/date-fns';
import {MuiPickersUtilsProvider, KeyboardTimePicker, KeyboardDatePicker,} from '@material-ui/pickers';
import Checkbox from '@material-ui/core/Checkbox';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import FormHelperText from '@material-ui/core/FormHelperText';
import ErrorDialogComponent from './ErrorDialogComponent';
import Snackbar from '@material-ui/core/Snackbar';
//redux
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {createReminderTask , setDefaultSnackBarTextState} from '../../../redux/actions/reminderActions';


const init_state = {
    "remind_me_by"  : ""   ,
    "title_reminder" : ""  ,
    "saying"        : ""   ,
    "every"         : ""    ,
    "every_data_weekDay"       : "Monday"    ,  
    "every_data_Time"          : "Sun Januar 01 "+new Date().getFullYear()+" 00:00:00 GMT+0000 (Central European Summer Time)"    ,  
    "every_data_startDate"     : "Sun Januar 01 "+new Date().getFullYear()+" 02:12:00 GMT+0000 (Central European Summer Time)"    , 
    "every_data_dayDifference" : ""    , 
    "email"         : ""     ,
    "singup"        : false,
    "password"      : ""     ,
    "errors"        : {
        "title_reminderERROR" : "",
        "sayingERROR" : "",
        "every_data_TimeERROR" : "",
        "every_data_startDateERROR" : "",
        "every_data_dayDifferenceERROR" : "",
        "emailERROR" : "",
        "passwordERROR" : "",
        "everyCheckedError" : "",
        "remindMeCheckedError" : ""
    },
    "openDialog" : false,
    "dataDialog" : "",
    "openSnackbar" : false
}

class CreateForm extends Component {
    // ________________________ constructor _____________________________________________________
    constructor(){
        super();
        this.state = init_state;
    }
    // ____________________________ getDerivedStateFromProps ______________________________________
    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.snackbarText !== "") {
            if (nextProps.snackbarText === "Created Reminder!"){
                return ({
                    "remind_me_by"  : ""   ,
                    "title_reminder" : ""  ,
                    "saying"        : ""   ,
                    "every"         : ""    ,
                    "every_data_weekDay"       : "Monday"    ,  
                    "every_data_Time"          : "Sun Januar 01 "+new Date().getFullYear()+" 00:00:00 GMT+0000 (Central European Summer Time)"    ,  
                    "every_data_startDate"     : "Sun Januar 01 "+new Date().getFullYear()+" 02:12:00 GMT+0000 (Central European Summer Time)"    , 
                    "every_data_dayDifference" : ""    , 
                    "email"         : ""     ,
                    "singup"        : false,
                    "password"      : ""     ,
                    "errors"        : {
                        "title_reminderERROR" : "",
                        "sayingERROR" : "",
                        "every_data_TimeERROR" : "",
                        "every_data_startDateERROR" : "",
                        "every_data_dayDifferenceERROR" : "",
                        "emailERROR" : "",
                        "passwordERROR" : "",
                        "everyCheckedError" : "",
                        "remindMeCheckedError" : ""
                    },
                    "openDialog" : false,
                    "dataDialog" : "",
                    openSnackbar : true
                })
            } else{
                return ({openDialog : true,
                dataDialog : nextProps.snackbarText,})
            }
        }
    }

    /* *******************************************************************************************
                HANDLE CHANGE
    ******************************************************************************************* */

    // ________________________ handleChange (event)________________________________________
    handleChange = event =>{
        this.setState({
            [event.target.name] : event.target.value
        })
    }
    // ________________________ handleChangeTime (event)________________________________________
    handleChangeTime = event =>{
        this.setState({
            "every_data_Time" : event
        })
    }
    // ________________________ handleChangeDate (event)________________________________________
    handleChangeDate = event =>{
        this.setState({
            "every_data_startDate" : event
        })
    }

    // ________________________ handleChangeCheckBox (event)________________________________________
    handleChangeCheckBox = event =>{
        this.setState({
            "singup" : event.target.checked
        })
    }
    // ________________________ handleCloseSnackbar ()________________________________________
    handleCloseSnackbar = () =>{
        this.setState({
            "openSnackbar" : false
        })
    }
    // ________________________ handleErrorDialogClose ()________________________________________
    handleErrorDialogClose = () =>{
        this.setState({
            openDialog : false,
            dataDialog : "",
        })
        this.props.setDefaultSnackBarTextState();
    }

    /* *******************************************************************************************
                HANDLE CHANGE END
    ******************************************************************************************* */

    returnNiceDate = dateIN =>{
        let month = dateIN.getUTCMonth() + 1; //months from 1-12
        let day = dateIN.getUTCDate();
        let year = dateIN.getUTCFullYear();
        return ""+year+"-"+month+"-"+day;
    }

    // ________________________ handleSubmit (event)________________________________________
    handleSubmit = async event =>{
       event.preventDefault();
       const IsInputValid = this.validateInput();

        if(!IsInputValid){
            return;
        }
        //////////////////////////////////////////////////////////////////////////////////////////////////////
        let timeToPost = new Date(this.state.every_data_Time);
        let dateToPost = new Date(this.state.every_data_startDate);
        if (this.state.every === "week"){
            let d = new Date()
            const WEEK_DAYS = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
            let dayIndex = WEEK_DAYS.indexOf(this.state.every_data_weekDay)
            dateToPost = new Date(d.setDate(d.getDate() + ((7-d.getDay())%7+dayIndex) % 7));
        }
        dateToPost = this.returnNiceDate(dateToPost);
    
        let nextDateToPost = new Date(dateToPost);
        //setting up the next date
        switch(this.state.every){
            case 'week':
                nextDateToPost.setDate(nextDateToPost.getDate() + 7);
                break;
            case 'forthnight':
                nextDateToPost.setDate(nextDateToPost.getDate() + 14);
                break;
            case 'month':
                nextDateToPost.setDate(nextDateToPost.getDate() + 30);
                break;
            case 'onceoff':
                nextDateToPost.setDate(nextDateToPost.getDate() + 0);
                break;
            case 'custom':
                nextDateToPost.setDate(nextDateToPost.getDate() + Number(this.state.every_data_dayDifference));
                break;
        }
        nextDateToPost = this.returnNiceDate(nextDateToPost);


        this.props.createReminderTask({
            email       :this.state.email,
                    password    :this.state.password,
                    remind_by   :this.state.remind_me_by,
                    title_reminder :this.state.title_reminder,
                    every       :this.state.every    ,
                    start_date  : dateToPost,
                    time        :timeToPost.getUTCHours() + ":"+timeToPost.getUTCMinutes()+ ":"+timeToPost.getUTCSeconds()   ,
                    reminder_text: this.state.saying,
                    day_difference_between_reminders:this.state.every_data_dayDifference,
                    nextDate : nextDateToPost,
        });
    }

    // ________________________ validateInput (event)________________________________________
    validateInput = () =>{
        let invalidInputsObject = {}
       // ------- Setting Regex to compare ---------------------
       const emailVerify              = /[^@]+@[^\.]+\..+/;
       const sayingVerify             = /^.{20,1000}$/; // 20-1000 characters                 
       const titleOfReminderVerify    = /^.{5,20}$/;  // 5-20 characters
       const verifyDateAndTime = /^[A-Z][a-z]{2,5} [A-Z][a-z]{2,8} \d\d \d{4} \d\d:\d\d:\d\d GMT\+\d{4} [A-Za-z() ]+/;


       let dd_value = Number(this.state.every_data_dayDifference); // day difference value
       let pwd_len = this.state.password.length;

       // ------- Check if all equals to empty -----------------

        //this.state.email
        if (this.state.email === ""){invalidInputsObject["emailError"]   = "Email must not be empty!";}
        else if (!emailVerify.test(this.state.email))
                {invalidInputsObject["emailError"] = "Email is not valid! Correct Format is : example@example.com";}

        /*//this.state.password
        if (this.state.password === ""){invalidInputsObject["passwordError"]  = "Password must not be empty!";}
        else if(!( 5 < pwd_len && pwd_len < 40) ){invalidInputsObject["passwordError"] = "Password must be between 6-20 characters!";}
        */
        //this.state.saying
        if (this.state.saying ===""){invalidInputsObject["sayingError"]   = "Saying message must not be empty!";}
        else if(!sayingVerify.test(this.state.saying))
                {invalidInputsObject["sayingError"] = "Saying message must be between 20-1000 characters!";}

        //this.state.title_reminder
        if (this.state.title_reminder ==="") {invalidInputsObject["titleOfReminderError"]   = "Title of reminder must not be empty!";}
        else if(!titleOfReminderVerify.test(this.state.title_reminder))
                {invalidInputsObject["titleOfReminderError"] = "Title of reminder must be between 5-20 characters containing letters and numbers only!";}
        
        //this.state.remind_me_by
        if (this.state.remind_me_by ==="")
        {invalidInputsObject["remindMeCheckedError"]   = "Please choose how you want to receive your reminders either: text, email, slack or calendar!";}
            
        //this.state.every
        if (this.state.every ==="")
        {invalidInputsObject["everyCheckedError"]   = "Please choose the times you want to recive your reminders: week, forthnight, month, onceoff!";}
            else{
                //
                //-----------------------------------------------------------------------------------------------------------------switch(this.state.every) {
                //
                switch(this.state.every) { 
                    case "week": //______________________________________________________________________________________________________________
                        if (this.state.every_data_Time ===""){invalidInputsObject["desiredTimeError"]   = "Time must not be empty!";}
                        else if(!verifyDateAndTime.test(this.state.every_data_Time))
                                {invalidInputsObject["desiredTimeError"] = "Time must be in a valid format!";}
                      break;
                    case "forthnight":
                    case "month":
                    case "onceoff": //______________________________________________________________________________________________________________
                        if (this.state.every_data_Time ===""){invalidInputsObject["desiredTimeError"]   = "Time must not be empty!";}
                        else if(!verifyDateAndTime.test(this.state.every_data_Time))
                                {invalidInputsObject["desiredTimeError"] = "Time must be in a valid format!";}

                        //this.state.every_data_startDate
                        if (this.state.every_data_startDate ===""){invalidInputsObject["desiredDateError"]   = "Date must not be empty!";}
                        else if(!verifyDateAndTime.test(this.state.every_data_Time))
                                {invalidInputsObject["desiredDateError"] = "Date must be in a valid format!";}
                        break;
                    case "custom": //______________________________________________________________________________________________________________
                        if (this.state.every_data_Time ===""){invalidInputsObject["desiredTimeError"]   = "Time must not be empty!";}
                        else if(!verifyDateAndTime.test(this.state.every_data_Time))
                                {invalidInputsObject["desiredTimeError"] = "Time must be in a valid format!";}

                        //this.state.every_data_startDate
                        if (this.state.every_data_startDate ===""){invalidInputsObject["desiredDateError"]   = "Date must not be empty!";}
                        else if(!verifyDateAndTime.test(this.state.every_data_Time))
                                {invalidInputsObject["desiredDateError"] = "Date must be in a valid format!";}
                        //this.state.every_data_dayDifference
                        if (this.state.every_data_dayDifference ==="") {invalidInputsObject["dayDifferenceError"]   = "Day Difference must not be empty!";}
                        else if(!( 1 < dd_value && dd_value < 2000))
                                {invalidInputsObject["dayDifferenceError"] = "Day difference must be a number between 1 and 2000 !";}
                    break;
                    default:
                        invalidInputsObject["everyCheckedError"]   = "Please choose the times you want to recive your reminders: week, forthnight, month, onceoff!";
                  } // switch end
            } // else end


            if (Object.keys(invalidInputsObject).length > 0){ //check if our object is empty

                this.setState({
                    "errors"        : {
                        "title_reminderERROR"           :invalidInputsObject["titleOfReminderError"]    === undefined? "" : invalidInputsObject["titleOfReminderError"] ,
                        "sayingERROR"                   :invalidInputsObject["sayingError"]             === undefined? "" : invalidInputsObject["sayingError"] ,
                        "every_data_TimeERROR"          :invalidInputsObject["desiredTimeError"]        === undefined? "" : invalidInputsObject["desiredTimeError"] ,
                        "every_data_startDateERROR"     :invalidInputsObject["desiredDateError"]        === undefined? "" : invalidInputsObject["desiredDateError"] ,
                        "every_data_dayDifferenceERROR" :invalidInputsObject["dayDifferenceError"]      === undefined? "" : invalidInputsObject["dayDifferenceError"] ,
                        "emailERROR"                    :invalidInputsObject["emailError"]              === undefined? "" : invalidInputsObject["emailError"] ,
                        //"passwordERROR"                 :invalidInputsObject["passwordError"]           === undefined? "" : invalidInputsObject["passwordError"] ,
                        "everyCheckedError"             :invalidInputsObject["everyCheckedError"]       === undefined? "" : invalidInputsObject["everyCheckedError"],
                        "remindMeCheckedError"          :invalidInputsObject["remindMeCheckedError"]    === undefined? "" : invalidInputsObject["remindMeCheckedError"],
                    }
                })
                return false; // so that we can handle the bool later in our code
            }
            return true; // inputs pass every check
        } // validateInput end
     

    // ________________________ render _____________________________________________________
    render() {
        /****************************************************************************** */
        // templates for EVERY input fields - to change according to selected radio
        /****************************************************************************** */
        const input_startDate_Time = <>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <KeyboardDatePicker
                        margin="normal"
                        label="Pick Desired Date"
                        value={this.state.every_data_startDate}
                        onChange={this.handleChangeDate}
                        helperText  = {this.state.errors.every_data_startDateERROR}
                        error       = {this.state.errors.every_data_startDateERROR===""?false:true}
                    />
        </MuiPickersUtilsProvider>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <KeyboardTimePicker
                        margin="normal"
                        label="Pick Desired Time"
                        value={this.state.every_data_Time}
                        onChange={this.handleChangeTime}
                        helperText  = {this.state.errors.every_data_TimeERROR}
                        error       = {this.state.errors.every_data_TimeERROR===""?false:true}
                    />
        </MuiPickersUtilsProvider>
    </>
        const everyWeekInput = 
        <>
         <p> Choose Days on when do you want to recieve reminders</p>
                <Select
                id = "every_data_weekDay"
                name="every_data_weekDay"
                value={this.state.every_data_weekDay}
                onChange={this.handleChange}
                >
                    <MenuItem value="Monday">       Monday      </MenuItem>
                    <MenuItem value="Tuesday">      Tuesday     </MenuItem>
                    <MenuItem value="Wednesday">    Wednesday   </MenuItem>
                    <MenuItem value="Thursday">     Thursday    </MenuItem>
                    <MenuItem value="Friday">       Friday      </MenuItem>
                    <MenuItem value="Saturday">     Saturday    </MenuItem>
                    <MenuItem value="Sunday">       Sunday      </MenuItem>
                </Select>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <KeyboardTimePicker
                        margin="normal"
                        label="Pick Desired Time"
                        value={this.state.every_data_Time}
                        onChange={this.handleChangeTime}
                        helperText  = {this.state.errors.every_data_TimeERROR}
                        error       = {this.state.errors.every_data_TimeERROR===""?false:true}
                    />
                </MuiPickersUtilsProvider> 
        </>
        ////////////////////////////////////////////////////////////////
        const everyForthnightInput = 
        <>
            <p>You will be notified every 14days <br></br> from the date You Choose below at the Time that you specify</p>
            {input_startDate_Time}
        </>
        ////////////////////////////////////////////////////////////////
        const everyMonthInput = 
        <>
            <p>You will be notified every 30days from the date you choose below and onward</p>
            {input_startDate_Time}
        </>
        ////////////////////////////////////////////////////////////////
        const everyOnceoffInput = 
        <>
            <p>You will be notified Only once : at the date and time you choose below</p>
            {input_startDate_Time}
        </>
        ////////////////////////////////////////////////////////////////
        const everyCustomInput = 
        <>
        <p>You will be notified every X days , from the day difference you enter below, <br></br>
            starting from the date that you choose below at the Time that you specify</p>
            {input_startDate_Time}
            <TextField
                    id="outlined-number"
                    label="Day Difference"
                    value={this.state.every_data_dayDifference}
                    onChange={this.handleChange}
                    type="text"
                    margin="normal"
                    variant="outlined"
                    helperText  = {this.state.errors.every_data_dayDifferenceERROR}
                    error = {this.state.errors.every_data_dayDifferenceERROR===""?false:true}
                />
        </>


        /****************************************************************************** */
        // return
        /****************************************************************************** */
        return (
            <div className="margin-top-bottom-50px">
                {this.state.openDialog?
                <ErrorDialogComponent
                    closeErrorDialog={this.handleErrorDialogClose}
                    data={this.state.dataDialog}>
                </ErrorDialogComponent> 
                : null}

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
            message={<span id="message-id">Created reminder</span>}
            action={[
            <Button key="undo" color="secondary" size="small" onClick={this.handleCloseSnackbar}>
                Close
            </Button>
            ]}
      />


                
                <FormControl component="fieldset" onSubmit={this.handleSubmit} className="form-material">
                    
                    <FormLabel component="legend">Set Your New Remind Me!</FormLabel>
                    {/* ------------------------------------------------------------------ */}
                    {/* remind_me_by */}
                    {/* ------------------------------------------------------------------ */}
                    <p>Remind me by</p>
                    <RadioGroup
                        aria-label="remind_me_by"
                        name="remind_me_by"
                        value={this.state.remind_me_by}
                        onChange={this.handleChange}
                    >
                        <div>
                        <FormControlLabel value="text" control={<Radio />} label="text" />
                        <FormControlLabel value="email" control={<Radio />} label="email" />
                        <FormControlLabel value="calendar" control={<Radio />} label="calendar" />
                        <FormControlLabel value="slack" control={<Radio />} label="slack" />
                        </div>
                    </RadioGroup>
                    <FormHelperText error={this.state.errors.remindMeCheckedError===""?false:true}>{this.state.errors.remindMeCheckedError}</FormHelperText>

                    {/* ------------------------------------------------------------------ */}
                    {/* title_reminder */}
                    {/* ------------------------------------------------------------------ */}

                    <TextField
                        label="title of reminder"
                        margin="dense"
                        name="title_reminder"
                        value={this.state.title_reminder}
                        onChange={this.handleChange}
                        helperText  = {this.state.errors.title_reminderERROR}
                        error = {this.state.errors.title_reminderERROR===""?false:true}

                    />

                    {/* ------------------------------------------------------------------ */}
                    {/* saying */}
                    {/* ------------------------------------------------------------------ */}

                    <TextField
                        label="saying"
                        multiline
                        rows="4"
                        margin="normal"
                        variant="outlined"
                        name="saying"
                        value={this.state.saying}
                        onChange={this.handleChange}
                        helperText  = {this.state.errors.sayingERROR}
                        error = {this.state.errors.sayingERROR===""?false:true}
                    />

                    {/* ------------------------------------------------------------------ */}
                    {/* every */}
                    {/* ------------------------------------------------------------------ */}
                    <p>Every</p>
                    <RadioGroup
                        aria-label="every"
                        name="every"
                        value={this.state.every}
                        onChange={this.handleChange}
                    >
                        <div>
                        <FormControlLabel value="week" control={<Radio />} label="Week" />
                        <FormControlLabel value="forthnight" control={<Radio />} label="Forthnight" />
                        <FormControlLabel value="month" control={<Radio />} label="Month" />
                        <FormControlLabel value="onceoff" control={<Radio />} label="Once-off" />
                        <FormControlLabel value="custom" control={<Radio />} label="Custom" />
                        </div>
                    </RadioGroup>
                    <FormHelperText error={this.state.errors.everyCheckedError===""?false:true}>{this.state.errors.everyCheckedError}</FormHelperText>

                {/* ------------------------------------------------------------------ */}
                {/* Fields Based on EVERY */}
                {/* ------------------------------------------------------------------ */}
                -----------------------------------------------------------------------------
                <br></br>
                {this.state.every === "week"        ? everyWeekInput        :null}
                {this.state.every === "forthnight"  ? everyForthnightInput  :null}
                {this.state.every === "month"       ? everyMonthInput       :null}
                {this.state.every === "onceoff"     ? everyOnceoffInput     :null}
                {this.state.every === "custom"      ? everyCustomInput      :null}
                <br></br>
                -------------------------------------------------------------------------------
                
                {/* ------------------------------------------------------------------ */}
                {/*email*/}
                {/* ------------------------------------------------------------------ */}
                <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                <TextField
                        label="Email"
                        margin="dense"
                        type="email"
                        name="email"
                        value={this.state.email}
                        onChange={this.handleChange}
                        helperText  = {this.state.errors.emailERROR}
                        error = {this.state.errors.emailERROR===""?false:true}
                    />  

                {/* ------------------------------------------------------------------ */}
                {/*password*/}
                {/* ------------------------------------------------------------------ */}

                <TextField
                        label="Password"
                        type="password"
                        margin="dense"
                        name="password"
                        value={this.state.password}
                        onChange={this.handleChange}
                        //helperText  = {this.state.errors.passwordERROR}
                        //createerror = {this.state.errors.passwordERROR===""?false:true}
                    />
                {/* ------------------------------------------------------------------ */}
                {/*singup*/}
                {/* ------------------------------------------------------------------ */}
                <br></br> 
                <FormControlLabel
                        control={
                        <Checkbox checked={this.state.singup} onChange={this.handleChangeCheckBox} value="singup" />
                        }
                        label="Singup?"
                    />
                </Grid> 
                {/*or singup with google*/}
                {/* ------------------------------------------------------------------ */}
                <Grid item xs={12} sm={6}>
                    <br></br>
                    OR
                    <br></br><br></br>
                <Button variant="contained">
                singup with google    
                </Button>
                </Grid>
                </Grid> 
                {/* ------------------------------------------------------------------ */}
                {/*or singup with google*/}
                {/* ------------------------------------------------------------------ */}
                <Button variant="contained" color="primary" onClick={this.handleSubmit}>
                    Create RemindMe
                </Button>             
                </FormControl>
            </div>
        )
    }
}


// _______________________________ CreateForm.propTypes _________________________________________________
CreateForm.propTypes = {
    createReminderTask: PropTypes.func.isRequired,
    snackbarText : PropTypes.string.isRequired,
  };
  // _______________________________ mapStateToProps() ______________________________________________________
  const mapStateToProps = state =>({
    snackbarText: state.reminderInfo.snackbarText,
  });
  // _______________________________ mapActionsToProps() _____________________________________________________
  const mapActionsToProps = {
    createReminderTask  : createReminderTask,
    setDefaultSnackBarTextState : setDefaultSnackBarTextState,
  }
  // _______________________________ export default() ______________________________________________________
  export default connect(mapStateToProps, mapActionsToProps)(CreateForm);
