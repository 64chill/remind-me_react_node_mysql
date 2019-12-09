import React, { Component } from 'react'
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Grid from '@material-ui/core/Grid';
import {MuiPickersUtilsProvider, KeyboardTimePicker, KeyboardDatePicker,} from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';

import PropTypes from "prop-types";
import { editReminderSave} from '../../../redux/actions/myAccountPageActions';
import { connect } from 'react-redux';
/* *****************************************************************************************************
 * DETAILS COMPONENT
***************************************************************************************************** */
/*
***********************************************************************************************************************
DetailsComponent
***********************************************************************************************************************
*/
const WEEK_DAYS = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
class DetailsComponent extends Component {
    
    // ________________________ constructor _____________________________________________________
    constructor(props){
        super(props);
        //set to local time
        var offset = new Date().getTimezoneOffset();
        let timeDateFormatDATE = new Date(this.parseTime(props.reminder.time).toString());
        timeDateFormatDATE.setMinutes(timeDateFormatDATE.getMinutes() - offset);

        let localTime = ""+ timeDateFormatDATE.getHours() +":"+(timeDateFormatDATE.getMinutes()<10?"0":"")+timeDateFormatDATE.getMinutes();

        this.propsState = props.reminder;
        this.state = {
            open         : false,
            edit_clicked : false,
                    id          : props.reminder.id       == null || undefined? undefined :props.reminder.id,
                    title       : props.reminder.title    == null || undefined? undefined:props.reminder.title,
                    every       : props.reminder.every    == null || undefined? undefined :props.reminder.every,
                    text        : props.reminder.text     == null || undefined? undefined :props.reminder.text,
                    next_date   : props.reminder.next_date == null || undefined? undefined :new Date(props.reminder.next_date).toString(),
                    time        : localTime,//props.reminder.time      == null || undefined? undefined :props.reminder.time,
                    approved    : props.reminder.approved  == null || undefined? undefined :props.reminder.approved,
                    remind_by   : props.reminder.remind_by == null || undefined? undefined :props.reminder.remind_by,
                    day_difference : props.reminder.day_difference    == null || undefined? undefined :props.reminder.day_difference,
                    timeDateFormat : timeDateFormatDATE,
                    nextDateWeekDay: WEEK_DAYS[new Date(props.reminder.next_date).getDay()],
            "errors"        : {
                "title_reminderERROR" : "",
                "textERROR" : "",
                "timeERROR" : "",
                "nextDateERROR" : "",
                "dayDifferenceERROR" : "",
                    }
        }
        this.handleSaveButtonClick = this.handleSaveButtonClick.bind(this);
    }

    parseTime = t => {
        var d = new Date();
        var time = t.match( /(\d+)(?::(\d\d))?\s*(p?)/ );
        d.setHours( parseInt( time[1]) + (time[3] ? 12 : 0) );
        d.setMinutes( parseInt( time[2]) || 0 );
        return d;
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
            edit_clicked : false
        })
      }
    // ________________________ handleChange (event)________________________________________
    handleChange = event =>{
        this.setState({
            [event.target.name] : event.target.value
        })
    }
    // ________________________ handleChange (event)________________________________________
    handleReminderChange= newNum =>{
        this.props.isNumStateChange(newNum);
    }
    // _________________________ handleEditButtonClick()_____________________________________
    handleEditButtonClick = () => this.setState({edit_clicked : true});

    convertDateToReadableFormat = (date_in) =>{
        date_in = new Date(date_in);
        let month = date_in.getUTCMonth() + 1; //months from 1-12
        let day = date_in.getUTCDate();
        let year = date_in.getUTCFullYear();
        return ""+year+"-"+month+"-"+day;
    }
    
    // _________________________ handleSaveButtonClick()_____________________________________
     handleSaveButtonClick = async () =>{
        //check if fields are valid
        let isValid = this.validateInput();
        if (!isValid){
            return
        }

        // see if undefiend and add to our object
        // then lift the state up of the object
        let returnObject = {}
        if (this.state.id !== null && this.state.id !== undefined){
            returnObject["id"] = this.state.id
        }

        if (this.state.title !== null && this.state.title !== undefined){
            returnObject["title"] = this.state.title}

        if (this.state.every !== null && this.state.every !== undefined){
            returnObject["every"] = this.state.every}

        if (this.state.text !== null &&this.state.text !== undefined){
            returnObject["text"] = this.state.text}

        if (this.state.next_date !== null && this.state.next_date !== undefined){
            returnObject["next_date"] = this.convertDateToReadableFormat(new Date(this.state.next_date))
        }

        if (this.state.time !== null && this.state.time !== undefined){
            let newDate = new Date(this.state.timeDateFormat);
            //setting time to show to the user
            this.state.time = ""+(newDate.getHours() +":"+(newDate.getMinutes()<10?"0":"")+newDate.getMinutes());

            //set UTC time - setting time for database
            var offset = new Date().getTimezoneOffset();
            newDate.setMinutes(newDate.getMinutes() + offset);
            returnObject["time"] = ""+(newDate.getHours()<10?"0":"")+ newDate.getHours() +":"+(newDate.getMinutes()<10?"0":"")+newDate.getMinutes();
        }

        if (this.state.approved !== null && this.state.approved !== undefined){
            returnObject["approved"] = this.state.approved}

        if (this.state.remind_by !== null && this.state.remind_by !== undefined){
            returnObject["remind_by"] = this.state.remind_by}

        if (this.state.day_difference !== null && this.state.day_difference !== undefined){
            returnObject["day_difference"] = this.state.day_difference}

        if (this.state.every === "week"){
            let d = new Date()
            let dayIndex = WEEK_DAYS.indexOf(this.state.nextDateWeekDay)
            let newDate = d.setDate(d.getDate() + ((7-d.getDay())%7+dayIndex) % 7);
            returnObject["next_date"] = this.convertDateToReadableFormat(newDate);
        }
        this.propsState = this.state;
        this.propsState["timeDateFormat"] = this.state.timeDateFormat;
        this.propsState["next_date"] = this.state.next_date.toString();
        
        this.setState({
            edit_clicked : false
        });
        returnObject.id_reminder = this.props.reminder.id_reminder;
        this.props.editReminderSave(returnObject);
        this.props.handleSave(returnObject);
    }
    // _________________________ handleCancel()_____________________________________
    handleCancel = () => {
        this.setState({edit_clicked : false,
                    id          : this.propsState.id       == null || undefined? undefined :this.propsState.id,
                    title       : this.propsState.title    == null || undefined? undefined :this.propsState.title,
                    every       : this.propsState.every    == null || undefined? undefined :this.propsState.every,
                    text        : this.propsState.text     == null || undefined? undefined :this.propsState.text,
                    next_date   : this.propsState.next_date == null || undefined? undefined :new Date(this.propsState.next_date),
                    time        : this.propsState.time      == null || undefined? undefined :this.propsState.time,
                    approved    : this.propsState.approved  == null || undefined? undefined :this.propsState.approved,
                    remind_by   : this.propsState.remind_by == null || undefined? undefined :this.propsState.remind_by,
                    day_difference : this.propsState.day_difference    == null || undefined? undefined :this.propsState.day_difference,
                    timeDateFormat : this.propsState.timeDateFormat,
                    nextDateWeekDay: WEEK_DAYS[new Date(this.props.reminder.next_date+'T00:00:00Z').getDay()],
        })};
    // _________________________ handleChangeDate(event)_____________________________________
    handleChangeDate = event =>{
        this.setState({
            "next_date"  : event
        })
    }
    // _________________________ handleChangeTime(event)_____________________________________
    handleChangeTime = event =>{
        this.setState({
            "timeDateFormat"  : event
        })
    }
    
    render() {
        /** **************************************************************************************************** */
        /** **************************************************************************************************** */
        const showInfoComponent = <>
          <DialogTitle id="form-dialog-title">
          <Grid container spacing={2}>
            <Grid item xs={8}>
            Details
            </Grid>
            <Grid item xs={4}>
            <Button variant="contained" onClick={this.handleEditButtonClick}>EDIT</Button>
            </Grid>
          </Grid>          
          </DialogTitle>
          <DialogContent>
          <b>Remind me by : </b>                {this.state.remind_by} <br></br>
          <b>Title:</b>             <br></br>   {this.state.title}     <br></br>
          <b>Text: </b>             <br></br>   {this.state.text}      <br></br>
          <b>Every: </b>                        {this.state.every}     <br></br>

          {"week" === this.state.every?
          <><b>Days of the week</b> {this.state.nextDateWeekDay}</>
          : null
          }
          {"week" !== this.state.every?
          <><b>Next Reminder Date</b> {this.convertDateToReadableFormat(this.state.next_date)} </>
          : null}<br></br>
          <b>Time: </b>                        {this.state.time}     <br></br>
          {typeof this.state.day_difference !== "undefined" ?
          <><b>Day Difference</b> {this.state.day_difference}</>
          : null
          }
          
          </DialogContent>
          <DialogActions>
             <Button onClick={this.handleClose} color="primary">
                Close
             </Button>
          </DialogActions>
      </>
      /** **************************************************************************************************** */
      /** **************************************************************************************************** */
      // -------------------------------------------------------------------------------------------------
      // -------------------------------------------------------------------------------------------------
      // -------------------------------------------------------------------------------------------------
      /* REMIND ME - Generate so that the chosen one is selected automatically */
      const remind_byList =["text" , "email", "calendar", "slack"]
      const remindmeListToShowFilter = remind_byList.filter( item =>{
        return item !== this.state.remind_by
    }
    )
    const remindmeListToShow = remindmeListToShowFilter.map(remindby => {
        return <MenuItem value={remindby}>{remindby}</MenuItem>
    })
    // -------------------------------------------------------------------------------------------------
    /* EVERY LIST- Generate so that the chosen one is selected automatically */
    const everlyList = ["week" , "forthnight", "month", "onceoff", "custom"]
    const everlyListToShowFilter = everlyList.filter( item =>{
      return item !== this.state.every
  }
  )
  const everlyListToShow = everlyListToShowFilter.map(remindby => {
      return <MenuItem value={remindby}>{remindby}</MenuItem>
  })

  // -------------------------------------------------------------------------------------------------
      const editInfoComponent =
      <>
      <DialogTitle id="form-dialog-title">
          <Grid container spacing={2}>
            <Grid item xs={8}>
                Details
            </Grid>
            <Grid item xs={4}>
                <Button variant="outlined" color="primary" onClick={this.handleSaveButtonClick}>SAVE</Button>
            </Grid>
          </Grid>          
        </DialogTitle>
        <DialogContent>

            <InputLabel htmlFor="remindme_select">Remind me by : </InputLabel>
            <Select
            name ="remind_by"
            id="remindme_select"
            value={this.state.remind_by}
            onChange = {this.handleChange}>
                <MenuItem value={this.state.remind_by}>
                {this.state.remind_by}
                </MenuItem>
                {remindmeListToShow}
            </Select>
            <br></br>
            <TextField
                helperText  = {this.state.errors.title_reminderERROR}
                error = {this.state.errors.title_reminderERROR===""?false:true}
                name="title"
                id="outlined-name"
                label="Title"
                value={this.state.title} 
                margin="normal"
                variant="outlined"
                onChange = {this.handleChange}
            />
            <br></br>
            <TextField
                helperText  = {this.state.errors.textERROR}
                error = {this.state.errors.textERROR===""?false:true}
                name="text"
                label ="Text"
                multiline
                rows="2"
                margin="normal"
                variant="outlined"
                value={this.state.text}
                onChange = {this.handleChange}
                />
            <br></br>
            <InputLabel htmlFor="remindme_select">Every : </InputLabel>
            <Select disabled
            name="every"
            onChange = {this.handleChange}
            id="every_select"
            value={this.state.every}>
                <MenuItem value={this.state.every}>
                {this.state.every}
                </MenuItem>
                {everlyListToShow}
            </Select>

            {"week" === this.state.every?
            <>
            <br></br>
            <InputLabel htmlFor="every_data_weekDay">Week Day : </InputLabel>
            <Select
                name="nextDateWeekDay"
                id = "every_data_weekDay"
                value={this.state.nextDateWeekDay}
                onChange = {this.handleChange}
                >
                    <MenuItem value="Monday">       Monday      </MenuItem>
                    <MenuItem value="Tuesday">      Tuesday     </MenuItem>
                    <MenuItem value="Wednesday">    Wednesday   </MenuItem>
                    <MenuItem value="Thursday">     Thursday    </MenuItem>
                    <MenuItem value="Friday">       Friday      </MenuItem>
                    <MenuItem value="Saturday">     Saturday    </MenuItem>
                    <MenuItem value="Sunday">       Sunday      </MenuItem>
                </Select>
            </>
            : null
            }
            {"week" !== this.state.every?
            <>
            <br></br>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <KeyboardDatePicker
                            helperText  = {this.state.errors.nextDateERROR}
                            error = {this.state.errors.nextDateERROR===""?false:true}
                            margin="normal"
                            label="Edit next date"
                            value={this.state.next_date}
                            onChange={this.handleChangeDate}
                            name="next_date"
                        />
            </MuiPickersUtilsProvider>
            </>
            : null}<br></br>


            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <KeyboardTimePicker
                        helperText  = {this.state.errors.timeERROR}
                        error = {this.state.errors.timeERROR===""?false:true}
                        margin="normal"
                        label="Edit Time"
                        value={this.state.timeDateFormat}
                        onChange={this.handleChangeTime}
                    />
        </MuiPickersUtilsProvider>
            {typeof this.state.day_difference !== "undefined" ?
            <>
            <br></br>
            <TextField
                    helperText  = {this.state.errors.dayDifferenceERROR}
                    error = {this.state.errors.dayDifferenceERROR===""?false:true}
                    name="day_difference"
                    id="outlined-number"
                    label="Edit Day Difference"
                    value={this.state.day_difference}
                    type="number"
                    margin="normal"
                    variant="outlined"
                    onChange = {this.handleChange}
                />
                </>
            : null
            }
            <DialogActions>
             <Button onClick={this.handleCancel} color="primary">
                Cancel
             </Button>
          </DialogActions>
        </DialogContent>
      </>

      /** **************************************************************************************************** */
      /** **************************************************************************************************** */
        return (
            <>
            <Button variant="outlined" color="primary" onClick={this.handleClickOpen}>
                Details
            </Button>
            <Dialog open={this.state.open} onClose={this.handleClose} aria-labelledby="form-dialog-title">
                {this.state.edit_clicked? editInfoComponent : showInfoComponent}
            </Dialog>
            </>
        );
    }

    validateInput = () =>{
        let invalidInputsObject = {}

        const textVerify             = /^.{20,1000}$/; // 20-1000 characters                 
        const titleOfReminderVerify    = /^.{5,20}$/;  // 5-20 characters
        const dayDiffVerify = /^\d+$/;
        const verifyDateAndTime = /^[A-Z][a-z]{2,5} [A-Z][a-z]{2,8} \d\d \d{4} \d\d:\d\d:\d\d GMT\+\d{4} [A-Za-z() ]+/;

        //title
        if (this.state.title === ""){invalidInputsObject["title_reminderERROR"]   = "Title must not be empty!";}
        else if (!titleOfReminderVerify.test(this.state.title))
                {invalidInputsObject["title_reminderERROR"] = "Title is not valid! Ttitle should be between 5 and 20 characters! ";}
        //text
        if (this.state.text === ""){invalidInputsObject["textERROR"]   = "Text must not be empty!";}
        else if (!textVerify.test(this.state.text))
                {invalidInputsObject["textERROR"] = "Text is not valid! Ttitle should be between 20 and 1000 characters! ";}
        //time
        if (this.state.timeDateFormat === ""){invalidInputsObject["timeERROR"]   = "Time must not be empty!";}
        else if (!verifyDateAndTime.test(this.state.timeDateFormat))
                  {invalidInputsObject["timeERROR"] = "Time is not valid!";}
        //date
        if (this.state.next_date === ""){invalidInputsObject["nextDateERROR"]   = "Date must not be empty!";}
        else if (!verifyDateAndTime.test(this.state.next_date))
              {invalidInputsObject["nextDateERROR"] = "Date is not valid!";}
        //day difference
        if (this.state.day_difference !== null && this.state.day_difference !== undefined ){
            if (this.state.day_difference === ""){invalidInputsObject["dayDifferenceERROR"]   = "Day Difference must not be empty!";}
            else if (!dayDiffVerify.test(this.state.day_difference))
              {invalidInputsObject["dayDifferenceERROR"] = "Day Difference must be a number!";} 
        }

        if (Object.keys(invalidInputsObject).length > 0){ //check if our object is empty

            this.setState({
                "errors"        : {
                    "title_reminderERROR"   :invalidInputsObject["title_reminderERROR"] == null? "" : invalidInputsObject["title_reminderERROR"] ,
                    "textERROR"             :invalidInputsObject["textERROR"]           == null? "" : invalidInputsObject["textERROR"] ,
                    "timeERROR"             :invalidInputsObject["timeERROR"]           == null? "" : invalidInputsObject["timeERROR"] ,
                    "nextDateERROR"         :invalidInputsObject["nextDateERROR"]       == null? "" : invalidInputsObject["nextDateERROR"] ,
                    "dayDifferenceERROR"    :invalidInputsObject["dayDifferenceERROR"]  == null? "" : invalidInputsObject["dayDifferenceERROR"] ,
                }
            })
            return false; // so that we can handle the bool later in our code
        }
        return true; // inputs pass every check

        } // validateInput end
}
// _______________________________ DetailsComponent.propTypes _________________________________________________
DetailsComponent.propTypes = {
    editReminderSave: PropTypes.func.isRequired,  };
  // _______________________________ mapStateToProps() ______________________________________________________
  const mapStateToProps = state =>({});
  // _______________________________ mapActionsToProps() _____________________________________________________
  const mapActionsToProps = {
    editReminderSave  : editReminderSave,
  }
  // _______________________________ export default() ______________________________________________________
  export default connect(mapStateToProps, mapActionsToProps)(DetailsComponent);