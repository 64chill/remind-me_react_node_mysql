import React, { Component } from 'react'

import PropTypes from "prop-types";
import { confirmEmail } from '../../redux/actions/emailActions';
import { connect } from 'react-redux';

class EmailConfirmAccountPage extends Component {
    constructor(props){
        super(props);
        this.state = {
            textToShow : ""
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
        this.props.confirmEmail(this.props.match.params.token);           
    }

    render() {
        return (
            <div>
                Server received your request!
                <br></br>
                {this.state.textToShow}
            </div>
        )
    }
}
// _______________________________ EmailConfirmAccountPage.propTypes _________________________________________________
EmailConfirmAccountPage.propTypes = {
    confirmEmail: PropTypes.func.isRequired,
    text : PropTypes.string.isRequired,
  };
  // _______________________________ mapStateToProps() ______________________________________________________
  const mapStateToProps = state =>({
    text: state.emailInfo.text,
  });
  // _______________________________ mapActionsToProps() _____________________________________________________
  const mapActionsToProps = {
    confirmEmail  : confirmEmail,
  }
  // _______________________________ export default() ______________________________________________________
  export default connect(mapStateToProps, mapActionsToProps)(EmailConfirmAccountPage);
