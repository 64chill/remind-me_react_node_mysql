import React, { Component } from 'react'

import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

import RemoveApprovedEmailComponent from './RemoveApprovedEmailComponent';
import AddNewApprovedEditEmail from './AddNewApprovedEditEmail';

import PropTypes from "prop-types";
import { getApprovedEmailList, removeApprovedEmail } from '../../../redux/actions/myAccountPageActions';
import { connect } from 'react-redux';

class AllowedEditEmailsComponent extends Component {

     // ________________________ constructor _____________________________________________________
     constructor(){
        super();
        this.state = {
            openSnackbar : false,
            snackbarText : "",
            email_list: [],
            idToRemove: -1,/* [
                // id   title   time_period     approved    details
                {
                    id_reminder : 1,
                    approved_emails_to_edit_reminders_id : 1,
                    title       : "tittleReminder",
                    email       : "email@examil.com",
                 },{
                    id_reminder : 2,
                    approved_emails_to_edit_reminders_id : 2,
                    title       : "tittleReminder2",
                    email       : "email2@examil.com",
                 },{
                    id_reminder : 3,
                    approved_emails_to_edit_reminders_id : 3,
                    title       : "tittleReminde3r",
                    email       : "email3@examil.com",
                 }
                ]*/
        }       
    }
    // ____________________________ getDerivedStateFromProps ______________________________________
    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.removed_approved_email_id !== prevState.removed_approved_email_id) {
                return ({idToRemove : nextProps.removed_approved_email_id});
            }
        if (nextProps.snackbar_text !== prevState.snackbar_text && nextProps.snackbar_text !== "") {
            return ({
                openSnackbar : true,
                snackbarText : nextProps.snackbar_text
            });
        }
        if (nextProps.approved_email_list !== prevState.approved_email_list && nextProps.approved_email_list !== [] ) {
            return ({email_list : nextProps.approved_email_list});
        }
    }
    // ________________________ handleReminderChange (newValue)________________________________________
    handleEmailRemove = async removeID =>{
        //contact server with request to remove email 
        // after email is removed remove it from the provided list below
        //delete email
        this.props.removeApprovedEmail(removeID);
    }
    // ________________________ handleEmailRemoveFromTableFrontend ()________________________________________
    handleEmailRemoveFromTableFrontend = () =>{
        //remove email from our frontend list
        let newListToShow = this.state.email_list.filter((item) => {
            return item.approved_emails_to_edit_reminders_id !== this.state.idToRemove;
        });
        this.setState({
            email_list : newListToShow,
            idToRemove : -1,
        })
        this.setState({
            openSnackbar : true,
            snackbarText : "Removed : SUCCESS",
            });

    }
    // ________________________ handleCloseSnackbar ()________________________________________
    handleCloseSnackbar = () =>{
        this.setState({
            "openSnackbar" : false
        })
    }
    // ________________________ handleAddNewEmail ()________________________________________
    handleAddNewEmail = () =>{
        this.getDataFromDB();
        this.setState({
            openSnackbar : true,
            snackbarText : "Email is added.",
          });
    }

    // _______________________________ componentDidMount _____________________________
    async componentDidMount(){
        this.getDataFromDB()
        }
    // _______________________________ getDataFromDB _____________________________  
    async getDataFromDB(){    
        this.props.getApprovedEmailList();   
    }

    // ________________________ handleChange (event)________________________________________
    render() {
        
        let itemNum = 0;
        let emList;
        if(this.state.reminders_list !== []){
            emList = this.state.email_list.map(
                    email_item =>(
                        <TableRow key={email_item.approved_emails_to_edit_reminders_id}>
                            <TableCell component="th" scope="row" >
                                {++itemNum}
                            </TableCell>
                            <TableCell>{email_item.title}</TableCell>
                            <TableCell>{email_item.email}</TableCell>
                            <TableCell>
                                <RemoveApprovedEmailComponent
                                item          = {email_item}
                                onEmailRemove = {this.handleEmailRemove}
                                 />
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
                                <TableCell>Approved Email To Edit</TableCell>
                                <TableCell></TableCell>
                            </TableRow>
                            </TableHead>
                            <TableBody>
                        {emList}
                            </TableBody></Table></Paper>;
        return (
            <div className="margin-3-percent">
                {this.state.idToRemove !== -1?this.handleEmailRemoveFromTableFrontend():null}
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
                <AddNewApprovedEditEmail onAddNewEmail = {this.handleAddNewEmail} />
                 {showOnScreen}
            </div>
        )
    }
}
// _______________________________ AllowedEditEmailsComponent.propTypes _________________________________________________
AllowedEditEmailsComponent.propTypes = {
    removeApprovedEmail         : PropTypes.func.isRequired,
    getApprovedEmailList        : PropTypes.func.isRequired,
    removed_approved_email_id   : PropTypes.number.isRequired,
    snackbar_text               : PropTypes.string.isRequired,
    approved_email_list         : PropTypes.array.isRequired,
    
};
  // _______________________________ mapStateToProps() ______________________________________________________
  const mapStateToProps = state =>({
    removed_approved_email_id   : state.myAccountInfo.removed_approved_email_id,
    snackbar_text               : state.myAccountInfo.snackbar_text,
    approved_email_list         : state.myAccountInfo.approved_email_list,
  });
  // _______________________________ mapActionsToProps() _____________________________________________________
  const mapActionsToProps = {
    removeApprovedEmail  : removeApprovedEmail,
    getApprovedEmailList : getApprovedEmailList,
  }
  // _______________________________ export default() ______________________________________________________
  export default connect(mapStateToProps, mapActionsToProps)(AllowedEditEmailsComponent);
