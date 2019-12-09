import React, { Component } from 'react'
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import RegisterAnAccountDialog from './RegisterAnAccountDialog';

import PropTypes from "prop-types";
import { getEmailFromToken } from '../../../redux/actions/emailActions';
import { connect } from 'react-redux';

class EmailReminderComponent extends Component {

    // ________________________ constructor _____________________________________________________
    constructor(props){
        super(props);
        this.state = ({
            "email_value" : "",
            "helperText" : "This email address has not yet been singed up to Remind Me.",
            showSingUpDialog : false,
        })
       
    }
    // ____________________________ getDerivedStateFromProps ______________________________________
    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.email_value !== prevState.email_value) {
            if(nextProps.text !== ""  && nextProps.email_value !== undefined && nextProps.email_value !== null){
                return ({email_value : nextProps.email_value})
            }
        }
    }
    // ________________________________ componentDidMount() _______________________________________
    async componentDidMount(){
        //grab user email from DB
        this.props.getEmailFromToken(this.props.token);
    }

    // ________________________ handleChange (event)________________________________________
    handleChange = event =>{
        this.setState({
            [event.target.name] : event.target.value
        })
    }

     // ________________________ handleSubmit (event)________________________________________
     handleSubmit = event =>{
        this.setState({
            showSingUpDialog : true
        })
    }
    // ________________________ handleSubmit (event)________________________________________
    onCloseRegisterAnAccountDialog = () =>{
        this.setState({
            showSingUpDialog : false
        })
    }
    
    // ________________________ handleChange (event)________________________________________
    render() {       
        return (
            <div className="margin-top-bottom-50px">
                {this.state.showSingUpDialog?
                <RegisterAnAccountDialog
                closeRegisterAnAccountDialog={this.onCloseRegisterAnAccountDialog}
                email={this.state.email_value}
                />
                : null}

                <FormControl component="fieldset" onSubmit={this.handleSubmit} className="form-material">
                <TextField
                    value={this.state.email_value}
                    label="Email"
                    margin="normal"
                />
                <br></br>
                <Button variant="contained" color="primary" onClick={this.handleSubmit} name="singup">
                    SingUp
                </Button> 
                </FormControl>
            </div>
        )
    }
}

// _______________________________ EmailReminderComponent.propTypes _________________________________________________
EmailReminderComponent.propTypes = {
    confirmEmail: PropTypes.func.isRequired,
    email_value : PropTypes.string.isRequired,
  };
  // _______________________________ mapStateToProps() ______________________________________________________
  const mapStateToProps = state =>({
    email_value: state.emailInfo.account_email,
  });
  // _______________________________ mapActionsToProps() _____________________________________________________
  const mapActionsToProps = {
    getEmailFromToken  : getEmailFromToken,
  }
  // _______________________________ export default() ______________________________________________________
  export default connect(mapStateToProps, mapActionsToProps)(EmailReminderComponent);
