import React, { Component } from 'react'
import ReminderTableListComponent from './ReminderTableListComponent'
import UnapprovedRemindersComponent from './UnapprovedRemindersComponent'
import AllowedEditEmailsComponent from './AllowedEditEmailsComponent';


export default class MyAccountComponent extends Component {
    // ________________________ handleChange (event)________________________________________
    render() {
        return (
            <div className="margin-top-bottom-50px">
                <ReminderTableListComponent/>
                <AllowedEditEmailsComponent />
            </div>
        )
    }
}
