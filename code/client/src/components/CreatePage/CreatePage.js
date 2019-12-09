import React, { Component } from 'react'
import Navbar from '../other/Navbar'
import CreateForm from './create_page_components/CreateForm'

export default class CreatePage extends Component {
    render() {
        return (
            <div>
                <Navbar pageTitle="Create Page"/>
                <CreateForm/>
            </div>
        )
    }
}
