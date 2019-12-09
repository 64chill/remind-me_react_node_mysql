import React, { Component } from 'react'
import Navbar from '../other/Navbar'
import MyAccountComponent from './myaccount_page_components/MyAccountComponent'

import PropTypes from "prop-types";

//redux
import { connect } from 'react-redux'; //redux
import { checkUserSession } from '../../redux/actions/userActions';


class MyAccountPage extends Component {
    // ____________________________________________________
    static propTypes = {
        match: PropTypes.object.isRequired,
        location: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired
      };
      // ____________________________________________________
      constructor(props){
        super(props);
        //reddirect if user is not loggedin
        if (this.props.sessionActive === false) {
            this.props.history.push('/login');
        }
        //init our state here
        this.state = {
            sessionActive :true,
            showLoading : true,
        };
    }
    async componentDidMount(){
        this.setState({showLoading : false})        
        }

    // ____________________________________________________
    render() {
        //const { match, location, history } = this.props;
        return (this.state.showLoading) ?
        (<div>Loading....</div>)
        :
        (this.state.sessionActive)?(
            <div>
                <Navbar pageTitle="My Account Page"/>
                <MyAccountComponent/>
            </div>
        )
        :
        (<>reddirect</>)
    }
}


// _______________________________ ReduxExample.propTypes _________________________________________________
MyAccountPage.propTypes = {
    checkUserSession: PropTypes.func.isRequired,
    sessionActive: PropTypes.bool.isRequired
  };
  // _______________________________ mapStateToProps() ______________________________________________________
  const mapStateToProps = state =>({
    sessionActive: state.userinfo.sessionActive,
  });
  // _______________________________ mapActionsToProps() _____________________________________________________
  const mapActionsToProps = {
    checkUserSession  : checkUserSession,
  }
  // _______________________________ export default() ______________________________________________________
  export default connect(mapStateToProps, mapActionsToProps)(MyAccountPage);