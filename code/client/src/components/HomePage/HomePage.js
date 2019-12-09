import React, { Component } from 'react'
import Navbar from '../other/Navbar'

export default class HomePage extends Component {
    render() {
        return (
            <div>
                <Navbar pageTitle="Home Page"/>
                This is Home Page
            </div>
        )
    }
}
