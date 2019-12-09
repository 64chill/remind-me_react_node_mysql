import React, { Component } from 'react'
import PropTypes from "prop-types";
import { stopSpecificReminder } from '../../redux/actions/emailActions';
import { connect } from 'react-redux';

class StopReminderPage extends Component {
    // ________________________________ constructor(props) _______________________________________
    constructor(props){
        super(props);
        this.state = {
            textToShow : "",
        }
    }
    // ____________________________ getDerivedStateFromProps ______________________________________
    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.text !== prevState.text) {
            if(nextProps.text !== ""){
                return ({textToShow : nextProps.text})
            }
        }
    }
    // _______________________________ componentDidMount() ________________________________________
    componentDidMount(){
        this.props.stopSpecificReminder(this.props.match.params.token);           
    }
    render() {
        return (
            <div>
                <h1>{this.state.textToShow}</h1>
            </div>
        )
    }
}
// _______________________________ StopReminderPage.propTypes _________________________________________________
StopReminderPage.propTypes = {
    stopSpecificReminder: PropTypes.func.isRequired,
    text : PropTypes.string.isRequired,
  };
  // _______________________________ mapStateToProps() ______________________________________________________
  const mapStateToProps = state =>({
    text: state.emailInfo.text,
  });
  // _______________________________ mapActionsToProps() _____________________________________________________
  const mapActionsToProps = {
    stopSpecificReminder  : stopSpecificReminder,
  }
  // _______________________________ export default() ______________________________________________________
  export default connect(mapStateToProps, mapActionsToProps)(StopReminderPage);
