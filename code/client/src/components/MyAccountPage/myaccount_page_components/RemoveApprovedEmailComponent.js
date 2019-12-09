import React, { Component } from 'react'
import Grid from '@material-ui/core/Grid';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';

export default class RemoveApprovedEmailComponent extends Component {

    // ________________________ constructor _____________________________________________________
    constructor(props){
        super(props);
        this.state = {
            open : false
        }
    }

    // ________________________ handleClickOpen ()__________________________________________
    handleClickOpen = () =>{
        this.setState({
            open : true
        })
      }

    // ________________________ handleClose ()_____________________________________________
    handleClose = () =>{
        this.setState({
            open : false,
        })
      }
    // ________________________ onRemoveReminder ()_________________________________________
    onRemoveItem = () =>{
        this.props.onEmailRemove(this.props.item.approved_emails_to_edit_reminders_id);
        this.handleClose()
      }

    // ________________________ render _____________________________________________________
    render() {
        return (
            <>
            <Button variant="outlined" color="secondary" onClick={this.handleClickOpen}>
                                Remove
                            </Button>
            <Dialog open={this.state.open} onClose={this.handleClose} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">
                Are your sure that you want to remove: <br></br> {this.props.item.email}?
                <br></br> 
                From the {this.props.item.title} reminder?
            </DialogTitle>
            <DialogContent> 
                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <Button variant="contained" color="primary" onClick={this.handleClose}>Cancel</Button>
                    </Grid>
                    <Grid item xs={6}>
                        <Button variant="contained" color="secondary" onClick={this.onRemoveItem}>Remove</Button>
                    </Grid>
                </Grid>   
          </DialogContent>       
            </Dialog>
            </>
        )
    }
}
