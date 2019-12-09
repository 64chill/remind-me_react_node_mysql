import React, { Component } from 'react'
import PropTypes from "prop-types";
import { stopAllReminders } from '../../redux/actions/emailActions';
import { connect } from 'react-redux';

class StopAllRemindersPage extends Component {
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
        // ________________________________ componentDidMount() _______________________________________
    async componentDidMount(){
        this.props.stopAllReminders(this.props.match.params.token);    
    }
    render() {
        return (
            <div>
                <h1>{this.state.textToShow}</h1>
            </div>
        )
    }
}
// _______________________________ StopAllRemindersPage.propTypes _________________________________________________
StopAllRemindersPage.propTypes = {
    stopAllReminders: PropTypes.func.isRequired,
    text : PropTypes.string.isRequired,
  };
  // _______________________________ mapStateToProps() ______________________________________________________
  const mapStateToProps = state =>({
    text: state.emailInfo.text,
  });
  // _______________________________ mapActionsToProps() _____________________________________________________
  const mapActionsToProps = {
    stopAllReminders  : stopAllReminders,
  }
  // _______________________________ export default() ______________________________________________________
  export default connect(mapStateToProps, mapActionsToProps)(StopAllRemindersPage);