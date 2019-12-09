import React, { Component } from 'react'


export default class UnapprovedRemindersComponent extends Component {
    // ________________________ constructor _____________________________________________________
    constructor(){
       super();
       this.state = {
        unapproved_num :"2"
       }
    }
    // ________________________ onNumberStateChange _____________________________________________
    onNumberStateChange = changeNum =>{
        this.setState({
            unapproved_num : changeNum
        })
    }
    // ________________________ handleChange (event)________________________________________
    render() {
        return (
            <div>
                Max Unapproved Reminders for this address : {this.state.unapproved_num}
            </div>
        )
    }
}

