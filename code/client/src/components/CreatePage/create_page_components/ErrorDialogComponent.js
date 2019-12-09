import React, { Component } from 'react'
import Grid from '@material-ui/core/Grid';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';

export default class ErrorDialogComponent extends Component {

    // ________________________ constructor _____________________________________________________
    constructor(props){
        super(props);
        //this.props.data
        this.state = {
            open : true
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
        this.props.closeErrorDialog();
      }

    

    // ________________________ render _____________________________________________________
    render() {
        return (
            <>
            <Dialog open={this.state.open} onClose={this.handleClose} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">
                {this.props.data}                
            </DialogTitle>
            
            <DialogContent>
            <Grid container spacing={2}>
                    <Grid item xs={4}>
                    </Grid>
                    <Grid item xs={4}>
                    <Button variant="contained" color="primary" onClick={this.handleClose}>close</Button> 
                    </Grid>
                    <Grid item xs={4}>
                    </Grid>
                </Grid> 
          </DialogContent>       
            </Dialog>
            </>
        )
    }
}
