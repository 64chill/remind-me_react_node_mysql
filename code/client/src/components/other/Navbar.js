import React , { Component } from 'react'
import { Link } from 'react-router-dom'
// importing material components.......
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Popper from '@material-ui/core/Popper';
import Paper from '@material-ui/core/Paper';

const init_state = {
    anchorEl : null,
}

export default class Navbar extends Component {
    // ________________________ constructor _____________________________________________________
    constructor(props){
        super();
        this.state = init_state;
        
        this.useStyles = makeStyles(theme => ({
            root: {
            flexGrow: 1,
            background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
            },
            menuButton: {
            marginRight: theme.spacing(2),
            },
            typography: {
                padding: theme.spacing(2),
            },
        }));
    }
    // ________________________ handelMenuClcik _____________________________________________________
    handelMenuClcik = event => {
        const { currentTarget } = event;
        this.setState(state => ({
            anchorEl: state.anchorEl ? null : currentTarget,
        }));
    };

  
    // ________________________ render _____________________________________________________
    render() {
        const { anchorEl } = this.state;
        const open = Boolean(anchorEl);
        const id_menu = open ? 'no-transition-popper' : null;
        const navbarText = "Remind Me : " + this.props.pageTitle

        return (
            <div className={this.useStyles.root}>
            <AppBar position="static">
                <Toolbar variant="dense">
                <IconButton onClick={this.handelMenuClcik} edge="start" className={this.useStyles.menuButton} color="inherit" aria-label="Menu">
                    <MenuIcon  />
                </IconButton>
                <Typography variant="h6" color="inherit">
                    {navbarText}
                </Typography>
                </Toolbar>
            </AppBar>

            <Popper id={id_menu} open={open} anchorEl={anchorEl}>
                <Paper>
                    <Typography className={this.useStyles.typography}>
                        <Link to={`/`}> Home Page </Link>
                    </Typography>
                    <Typography className={this.useStyles.typography}>
                        <Link to={`/my-account`}> My Account </Link>
                    </Typography>
                    <Typography className={this.useStyles.typography}>
                        <Link to={`/create-reminder`}> Create Reminder </Link>
                    </Typography>
                </Paper>
            </Popper>
            </div>
        );
    }
}

