import React, { Component } from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Switch from '@material-ui/core/Switch';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import DetailsComponent from './DetailsComponent';
import RemoveDialogComponent from './RemoveDialogComponent';
//redux
import PropTypes from "prop-types";
import { 
    getReminderDataForSpecificUser,
    removeReminder,
    switchApproveReminder,
    changeReminderListFullList,
 } from '../../../redux/actions/myAccountPageActions';
import { connect } from 'react-redux';

class ReminderTableListComponent extends Component {
    // ________________________ constructor _____________________________________________________
    constructor(){
        super();
        this.state = {
            openSnackbar : false,
            snackbarText : "",
            // we fetch these from our API
            //for testing purpose : hardcoded data
            reminders_list: []
        };   
    }
     // ____________________________ getDerivedStateFromProps ______________________________________
     static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.reminders_list !== prevState.reminders_list) {
            if(nextProps.reminders_list !== ""){
                return ({reminders_list : nextProps.reminders_list})
            }
        }
        if (nextProps.snackbar_text !== prevState.snackbar_text && nextProps.snackbar_text !== "") {
            return{
                openSnackbar : true,
                snackbarText : nextProps.snackbarText
            }
        }
    }

    // ________________________ handleCloseSnackbar ()________________________________________
    handleCloseSnackbar = () =>{
        this.setState({
            "openSnackbar" : false
        })
    }

    // ________________________ handleChangeSwitch (event)________________________________________
    handleChangeSwitch = async event =>{
        let index_in_list = Number(event.target.name.replace("-switch" , ""))-1;

        let new_reminders_list = this.state.reminders_list;
        new_reminders_list[index_in_list].approved = event.target.checked;
        this.setState({
            reminders_list: new_reminders_list
          })
          //update the database
          this.props.switchApproveReminder(new_reminders_list[index_in_list].id_reminder,event.target.checked);             
          }
    // ________________________ handleChangeSwitch (event)________________________________________
    handleEditTrue = obj =>{
        let newList = [];
        this.state.reminders_list.forEach(reminder =>{
            if(reminder.id_reminder == obj.id_reminder){
                newList.push(obj);
            } else {
                newList.push(reminder)
            }
        });
        this.props.changeReminderListFullList(newList);
    }
    // ________________________ handleReminderChange (newValue)________________________________________
    handleReminderChange = async reminderToRemoveID =>{
        //delete reminder
        this.props.removeReminder(reminderToRemoveID);
        let newListToShow = this.state.reminders_list.filter((item) => {
            return item.id_reminder !== reminderToRemoveID;
        });
        this.setState({
            reminders_list : newListToShow
        })
    }

    // _______________________________ componentDidMount _____________________________
     componentDidMount = () => {
        this.props.getReminderDataForSpecificUser();
        } 
    render() {
        
        let reminder_num = 0;
        let rowList;
        if(this.state.reminders_list !== []){
            rowList = this.state.reminders_list.map(
                    reminder =>(
                        <TableRow key={reminder.id}>
                            <TableCell component="th" scope="row">
                                {++reminder_num}
                            </TableCell>
                            <TableCell>{reminder.title}</TableCell>
                            <TableCell>{reminder.every}</TableCell>
                            <TableCell>

                                <Switch
                                    name = {reminder_num + "-switch"}
                                    onChange={this.handleChangeSwitch}
                                    checked={reminder.approved === 1?true:reminder.approved === true?true:false}
                                />
   
                            </TableCell>
                            <TableCell>
                            <DetailsComponent reminder={reminder} handleSave={this.handleEditTrue}/>
                            </TableCell>

                            <TableCell>
                                <RemoveDialogComponent reminder={reminder}  onReminderChange={this.handleReminderChange}/>
                            </TableCell>
                        </TableRow>
                    )
                );
            }

        let showOnScreen =  <Paper> <Table>
                            <TableHead>
                            <TableRow>
                                <TableCell>ID</TableCell>
                                <TableCell>Reminder Title</TableCell>
                                <TableCell>TimePeriod</TableCell>
                                <TableCell>Approved</TableCell>
                                <TableCell>Details</TableCell>
                                <TableCell></TableCell>
                            </TableRow>
                            </TableHead>
                            <TableBody>
                        {rowList}
                            </TableBody></Table></Paper>;
        return (
            <div className="margin-3-percent">
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
                    message={<span id="message-id">{this.state.snackbarText}</span>}
                    action={[
                    <Button key="undo" color="secondary" size="small" onClick={this.handleCloseSnackbar}>
                        Close
                    </Button>
                    ]}
                />
                 {showOnScreen}
            </div>
        )
    }
}
// _______________________________ ReminderTableListComponent.propTypes _________________________________________________
ReminderTableListComponent.propTypes = {
    getReminderDataForSpecificUser: PropTypes.func.isRequired,
    removeReminder: PropTypes.func.isRequired,
    changeReminderListFullList: PropTypes.func.isRequired,
    switchApproveReminder: PropTypes.func.isRequired,
    snackbar_text: PropTypes.string.isRequired,
    reminders_list: PropTypes.array.isRequired,
  };
  // _______________________________ mapStateToProps() ______________________________________________________
  const mapStateToProps = state =>({
    reminders_list: state.myAccountInfo.reminders_list_full_list,
    snackbar_text: state.myAccountInfo.snackbar_text,
  });
  // _______________________________ mapActionsToProps() _____________________________________________________
  const mapActionsToProps = {
    getReminderDataForSpecificUser  : getReminderDataForSpecificUser,
    removeReminder                  : removeReminder,
    switchApproveReminder           : switchApproveReminder,
    changeReminderListFullList      : changeReminderListFullList
  }
  // _______________________________ export default() ______________________________________________________
  export default connect(mapStateToProps, mapActionsToProps)(ReminderTableListComponent);