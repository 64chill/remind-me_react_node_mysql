import React, { Component } from 'react'
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Snackbar from '@material-ui/core/Snackbar';

import TokenEditReminderPage from './TokenEditReminderPage'
import EmailReminderComponent from './components/EmailReminderComponent'

import PropTypes from "prop-types";
import {
    getUnapprovedMax,
    unsubscribeAll
    } from '../../redux/actions/emailActions';

import { connect } from 'react-redux';

class TokenMainEditReminderPage extends Component {
    // ________________________________ constructor(props) _______________________________________
    constructor(props){
        super(props);
        this.state = {
            maxUnapprovedNum : 0,
            openSnackbar : false,
            snackbarMessage : "",
            token_error : "",
        }
        this.handleUnsubscribe = this.handleUnsubscribe.bind(this);
    }
    // ____________________________ getDerivedStateFromProps ______________________________________
    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.text !== prevState.text) {
            if(nextProps.text !== ""){
                return ({
                    openSnackbar: true,
                    snackbarMessage: nextProps.text,})
            }
        }
        if (nextProps.unapprovedMaxNum !== prevState.unapprovedMaxNum) {
                return ({
                    maxUnapprovedNum : nextProps.unapprovedMaxNum
                })
        }
    }

    // ________________________ handleCloseSnackbar ()________________________________________
    handleCloseSnackbar = () =>{
        this.setState({
            openSnackbar : false
        })
    }
    // ________________________ handleOpenSnackbar ()________________________________________
    handleOpenSnackbar = (message) =>{
        this.setState({
            openSnackbar : true,
            snackbarMessage : message,
        })
    }
    // ________________________ handleOpenSnackbar ()________________________________________
    handleErrorFetchData = () =>{
        this.setState({
            token_error : "There was a problem with this token! Please try later if you are sure it is a valid one!"
        })
    }


    // ________________________________ componentDidMount() _______________________________________
    async componentDidMount(){
        this.props.getUnapprovedMax();
    }
    // ________________________________ handleUnsubscribe() _______________________________________
    async handleUnsubscribe(){
        this.props.unsubscribeAll(this.props.match.params.token);
    }

    // ________________________________ render() _______________________________________
    render() {
        console.log(this.props.match.params.token)
        return this.state.token_error === ""?(
            <div>
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

                <EmailReminderComponent token={this.props.match.params.token}/>
                <TokenEditReminderPage
                    token={this.props.match.params.token}
                    openSnackbar={this.handleOpenSnackbar}
                    onErrorFetchData={this.handleErrorFetchData}
                />
                <br></br>
                <br></br>
                <div>
                    Max Unapproved Reminders to this Address : {this.state.maxUnapprovedNum}
                </div>
                <br></br>
                <br></br>
                <div>

                <Grid container spacing={2}>
                    <Grid item xs={6}>
                    <Button variant="contained" color="primary" onClick={this.handleUnsubscribe}>
                    Unsubscribe from remind me
                </Button>
                    </Grid>
                    <Grid item xs={6}>
                        You will receive no emails from
                        Remind me unless you decide to
                        create an account.
                    </Grid>
                </Grid> 

                </div>
            </div>
        ):(<h1>{this.state.token_error}</h1>)
    }
} // 
// _______________________________ TokenMainEditReminderPage.propTypes _________________________________________________
TokenMainEditReminderPage.propTypes = {
    getUnapprovedMax : PropTypes.func.isRequired,
    unsubscribeAll     : PropTypes.func.isRequired,
    text                : PropTypes.string.isRequired,
    unapprovedMaxNum       : PropTypes.array.isRequired,
  };
  // _______________________________ mapStateToProps() ______________________________________________________
  const mapStateToProps = state =>({
    text            : state.emailInfo.text,
    unapprovedMaxNum   : state.emailInfo.unapprovedMaxNum,
  });
  // _______________________________ mapActionsToProps() _____________________________________________________
  const mapActionsToProps = {
    getUnapprovedMax  : getUnapprovedMax,
    unsubscribeAll    : unsubscribeAll,
  }
  // _______________________________ export default() ______________________________________________________
  export default connect(mapStateToProps, mapActionsToProps)(TokenMainEditReminderPage);
