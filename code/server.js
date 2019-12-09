const express = require('express');
const app = express();
const session = require('express-session');
const SESSION_VARIABLES = require('./data_variables/session_info');
const path = require('path')
const reminder_sender = require ('./modules/reminder_sender');
const EMAIL_SENDER = require("./modules/email_sender");


app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const PORT = process.env.PORT || 5000;

/*********************************************************************************************************
 *  IF ENVIROMENT == PRODUCTION
 *********************************************************************************************************/
if(process.env.NODE_ENV === "production"){
    //set static folder
        app.use(express.static('client/build'));
        
        app.get('*' , (req,res) =>{
            res.sendFile(path.resolve(__dirname , 'client' , 'build', 'index.html'));
        });
            /*
            __dirname - current directory
            */
        
    }
/*********************************************************************************************************
 *  Adding a session - cookie to the user upon visiting the website
 *  Later we will use this data for the purpose of loging and loging out the user etc.
 *********************************************************************************************************/
app.use(session({
    name : SESSION_VARIABLES.SESSION_NAME,
    resave: false,
    saveUninitialized : false,
    secret : SESSION_VARIABLES.SESSION_SECRET,
    cookie :{
        maxAge: SESSION_VARIABLES.SESSION_LIFETIME ,
        sameSite: true,
        secure: false // TRUE in production mode - https
    },

}));

/*********************************************************************************************************
 *  Router, listen on port ....
 *********************************************************************************************************/
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
app.use('/api/acc' , require('./routes/api/acc'));
app.use('/api/reminder' , require('./routes/api/reminder'));
app.use('/api/email' , require('./routes/api/email'));


/*********************************************************************************************************
 *  Send out reminders
 *********************************************************************************************************/

setInterval(function(){ 
    reminder_sender.checkAndIfNeededSendOutReminders(); },
     60000);

