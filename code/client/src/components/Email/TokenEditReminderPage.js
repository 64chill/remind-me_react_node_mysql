import React, { Component } from 'react'
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import {MuiPickersUtilsProvider, KeyboardTimePicker, KeyboardDatePicker,} from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';

import ErrorDialogComponent from '../CreatePage/create_page_components/ErrorDialogComponent';

import PropTypes from "prop-types";
import {
    getApprovedEditData,
    getMainEditData,
    editReminder,
    setEmptyText } from '../../redux/actions/emailActions';

import { connect } from 'react-redux';


const WEEK_DAYS = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
class TokenEditReminderPage extends Component {

    constructor(props){
        super(props);
        this.state = {
                    received_data : null,
                    id          : "",
                    title       : "",
                    every       : "",
                    text        : "",
                    next_date   : "",
                    time        : "",
                    approved    : "",
                    remind_by   : "",
                    day_difference : "",
                    timeDateFormat : "",
                    nextDateWeekDay: "",
                    id_user : 0,
            "errors"        : {
                "title_reminderERROR" : "",
                "textERROR" : "",
                "timeERROR" : "",
                "nextDateERROR" : "",
                "dayDifferenceERROR" : "",
                    },
            showErrorDialog: false,
            showErrorDialogText: "",
        }
        this.handleSaveButtonClick = this.handleSaveButtonClick.bind(this);
    }
    // ____________________________ getDerivedStateFromProps ______________________________________
    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.text !== prevState.text && nextProps.text != "Unsubscribe : Success!" ) {
            if(nextProps.text !== "" && nextProps.text !== undefined && nextProps.text !== null  ){
                return ({
                    showErrorDialog: true,
                    showErrorDialogText: nextProps.text,})
            }
        }
        if (nextProps.received_data !== prevState.received_data && nextProps.received_data !== undefined && nextProps.received_data !== null  &&  nextProps.received_data.length > 0) {
            /*return{
                    received_data : nextProps.received_data
                }*/
            let offset = new Date().getTimezoneOffset();
            //
            let d = new Date();
            let t = nextProps.received_data[0].time;
            let time = t.match( /(\d+)(?::(\d\d))?\s*(p?)/ );
            d.setHours( parseInt( time[1]) + (time[3] ? 12 : 0) );
            d.setMinutes( parseInt( time[2]) || 0 );
            //
            let timeDateFormatDATE = new Date(d);
            timeDateFormatDATE.setMinutes(timeDateFormatDATE.getMinutes() - offset);
            let localTime = ""+ timeDateFormatDATE.getHours() +":"+(timeDateFormatDATE.getMinutes()<10?"0":"")+timeDateFormatDATE.getMinutes();
            return {
                id          : nextProps.received_data[0].id,
                title       : nextProps.received_data[0].title,
                every       : nextProps.received_data[0].every,
                text        : nextProps.received_data[0].text ,
                next_date   : new Date(nextProps.received_data[0].next_date).toString(),                        
                time        : localTime,
                approved    : nextProps.received_data[0].approved === 1? "approved" : "disabled",
                remind_by   : nextProps.received_data[0].remind_by,
                day_difference : nextProps.received_data[0].day_difference,
                timeDateFormat : timeDateFormatDATE,
                nextDateWeekDay: WEEK_DAYS[new Date(nextProps.received_data[0].next_date).getDay()],
                showErrorFetchingData : "",
                id_user : nextProps.received_data[0].id_user,
                received_data : nextProps.received_data
            }
        }
        return null;
    }
    // ______________________________ validateInput() _______________________________________________-
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
    // _________________________ onCloseErrorDialog() _______________________________________________
    onCloseErrorDialog = () => {
        this.setState({
            showErrorDialog : false
        })
        //TODO CLEAR REDUX
        this.props.setEmptyText();
    }
    // _________________________ parseTime() _______________________________________________
    parseTime = t => {
        var d = new Date();
        var time = t.match( /(\d+)(?::(\d\d))?\s*(p?)/ );
        d.setHours( parseInt( time[1]) + (time[3] ? 12 : 0) );
        d.setMinutes( parseInt( time[2]) || 0 );
        return d;
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
    // ________________________ handleChange (event)________________________________________
    handleChange = event =>{
        this.setState({
            [event.target.name] : event.target.value
        })
    }
    // ________________________ handleChange (event)________________________________________
    handleCancelClick = () =>{
        this.setStateReceivedData();
        this.setState({
            "errors"        : {
                "title_reminderERROR" : "",
                "textERROR" : "",
                "timeERROR" : "",
                "nextDateERROR" : "",
                "dayDifferenceERROR" : "",
            }
        });
    }
    // _________________________ handleSaveButtonClick()_____________________________________
    handleSaveButtonClick = async () =>{
        //check if fields are valid
        let isValid = this.validateInput();
        if (!isValid){
            return
        }
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
        let user_token;
        if (this.props.token){user_token = this.props.token;}
        else { user_token = this.props.match.params.token}
        let send_data = {
            title			: returnObject.title,
            text			: returnObject.text,
            approved		: returnObject.approved,
            next_date		: returnObject.next_date,
            remind_by		: returnObject.remind_by,
            every			: returnObject.every,
            time			: returnObject.time,
            day_difference  : returnObject.day_difference,
            id_reminder 	: this.state.id,
            id_user         : this.state.id_user
        }
        this.props.editReminder(user_token, send_data, this.state.received_data[0].approved);
    }

    componentDidMount(){
        if(this.props.token){
            this.props.getMainEditData(this.props.token);
        }else {
            this.props.getApprovedEditData(this.props.match.params.token);
            }           
    }

    // _________________________ setStateReceivedData()_____________________________________
    setStateReceivedData = () => {
        let offset = new Date().getTimezoneOffset();
        let timeDateFormatDATE = new Date(this.parseTime(this.state.received_data[0].time).toString());
        timeDateFormatDATE.setMinutes(timeDateFormatDATE.getMinutes() - offset);
        let localTime = ""+ timeDateFormatDATE.getHours() +":"+(timeDateFormatDATE.getMinutes()<10?"0":"")+timeDateFormatDATE.getMinutes();
        this.setState(
            {
                id          : this.state.received_data[0].id,
                title       : this.state.received_data[0].title,
                every       : this.state.received_data[0].every,
                text        : this.state.received_data[0].text ,
                next_date   : new Date(this.state.received_data[0].next_date).toString(),                        
                time        : localTime,
                approved    : this.state.received_data[0].approved === 1? "approved" : "disabled",
                remind_by   : this.state.received_data[0].remind_by,
                day_difference : this.state.received_data[0].day_difference,
                timeDateFormat : timeDateFormatDATE,
                nextDateWeekDay: WEEK_DAYS[new Date(this.state.received_data[0].next_date).getDay()],
                showErrorFetchingData : "",
                id_user : this.state.received_data[0].id_user,
            }
        );

    }
    // ________________________________________ render() _____________________________________
    render() {
        /* REMIND ME - Generate so that the chosen one is selected automatically */
        const remind_byList =["text" , "email", "calendar", "slack"]
        const remindmeListToShowFilter = remind_byList.filter( item =>{
            return item !== this.state.remind_by
        });
        const remindmeListToShow = remindmeListToShowFilter.map(remindby => {
            return <MenuItem value={remindby}>{remindby}</MenuItem>
        })
        /* EVERY LIST- Generate so that the chosen one is selected automatically */
        const everlyList = ["week" , "forthnight", "month", "onceoff", "custom"]
        const everlyListToShowFilter = everlyList.filter( item =>{
            return item !== this.state.every
        });
        const everlyListToShow = everlyListToShowFilter.map(remindby => {
            return <MenuItem value={remindby}>{remindby}</MenuItem>
        })
        /////////////////////////////////////////////////////////////////////////////
        let showEditFields =
        <>
      <h3>
          <Grid container spacing={2}>
            <Grid item xs={6}>
                Edit Reminder
            </Grid>
            <Grid item xs={6}>
                <Button variant="contained" color="primary" onClick={this.handleSaveButtonClick}>SAVE</Button>
                <Button variant="contained" color="secondary" onClick={this.handleCancelClick}>CANCEL</Button>
            </Grid>
          </Grid>          
        </h3>
        <div>

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
            {this.state.day_difference !== null  ?
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
            <br></br>
            {this.props.token?
            <>
                <RadioGroup
                    aria-label="approved"
                    name="approved"
                    value={this.state.approved}
                    onChange={this.handleChange}
                >
                    <div>
                    <FormControlLabel value="approved" control={<Radio />} label="approved" />
                    <FormControlLabel value="disabled" control={<Radio />} label="disabled" />
                    </div>
                </RadioGroup>
                </>
                :null}
        </div>
      </>
        ;
        return (
            <div>
                {this.state.showErrorDialog?
                <ErrorDialogComponent
                    data={this.state.showErrorDialogText}
                    closeErrorDialog={this.onCloseErrorDialog}
                />
                : null}
                {showEditFields}
            </div>
        )
    }
}

// _______________________________ TokenEditReminderPage.propTypes _________________________________________________
TokenEditReminderPage.propTypes = {
    getApprovedEditData : PropTypes.func.isRequired,
    getMainEditData     : PropTypes.func.isRequired,
    editReminder        : PropTypes.func.isRequired,
    setEmptyText        : PropTypes.func.isRequired,
    text                : PropTypes.string.isRequired,
    received_data       : PropTypes.array.isRequired,
  };
  // _______________________________ mapStateToProps() ______________________________________________________
  const mapStateToProps = state =>({
    text            : state.emailInfo.text,
    received_data   : state.emailInfo.received_data,
  });
  // _______________________________ mapActionsToProps() _____________________________________________________
  const mapActionsToProps = {
    getApprovedEditData  : getApprovedEditData,
    getMainEditData      : getMainEditData,
    editReminder         : editReminder,
    setEmptyText         : setEmptyText,
  }
  // _______________________________ export default() ______________________________________________________
  export default connect(mapStateToProps, mapActionsToProps)(TokenEditReminderPage);