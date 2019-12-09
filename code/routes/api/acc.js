const express = require('express');
const bcrypt = require('bcrypt');
const moment = require('moment');
const app = express();
const router = express.Router();
const SESSION_VARIABLES = require('../../data_variables/session_info');
const DB_CONN = require('../../data_variables/db_info');
const TRANSPORTER = require('../../data_variables/email_info');
const EMAIL_SENDER = require("../../modules/email_sender");

/******************************* additional functions to make our code look cleaner a bit ***************/
const isEmailAndPasswordNotValid = (email_str, password_str) => {
    const emailVerify     = /[^@]+@[^\.]+\..+/;
    let error_list = [];
    if (email_str === ""){error_list.push("Email must not be empty!");}
        else if (!emailVerify.test(email_str))
            {error_list.push("Email is not valid! Correct Format is : example@example.com");}

    if (password_str === "") {error_list.push("Password must not be empty!");}
    
    if(error_list.length > 0){
        return error_list;
    }
    return false;

}

/*********************************************************************************************************
 *  /login
 *********************************************************************************************************/
router.post('/login' , async (req, res) => {
    
    let received_data = {
        email:        req.body.email,
        password:     req.body.password
    }
    // ------------------------------------------ check if email is in a valid format ------------------
    // and if password is empty
    isEmail = isEmailAndPasswordNotValid(received_data.email, received_data.password);
    
    if(isEmail){
        res.statusMessage = isEmail.toString(); // list of errors
        res.send(400);
    }
    // check with the DB if fields are valid
    //---------------- if everything is ok: create and add session, and redirect the user ---
    let sql_check = 'SELECT * FROM `users` WHERE user_email LIKE \'' + received_data.email + '\' AND  	confirmed_status = TRUE';
    let query_check = await DB_CONN.query(sql_check, (err, results) => {
        if(err){   
            console.log("500err");
            console.log(err);
            res.status(500).send();
        }
        if(results.length > 0){
            const hashed_pwd = results[0]['pwd_hash'];
            const user_id    = results[0]['id_user'];

            bcrypt.compare(received_data.password, hashed_pwd, function(err, res_db) {
                if(res_db) {
                    //password  match
                    /******************************* ADD session and send to the user */
                    req.session.uemail = received_data.email;
                    req.session.uid = user_id;
                    req.session.save()
                    res.send("login success");
                } else {
                    // password don't match
                    res.statusMessage = "Authentification Failed";
                    res.send(400);
                } 
              });
           
        } else {
            res.statusMessage = "Authentification Failed";
            res.send(400);
        }
    });
    return;
    
});

/*********************************************************************************************************
 *  /register
 *********************************************************************************************************/
router.post('/register' , async (req, res) => {
    
    let received_data = {
        email:        req.body.email,
        password:     req.body.password
    }

    // ------------------------------------------ check if email is in a valid format ------------------
    // and if password is empty
    isEmail = isEmailAndPasswordNotValid(received_data.email, received_data.password);
    
    if(isEmail){
        res.statusMessage = isEmail.toString(); // list of errors
        res.send(400);
    }
    // Hash the password with the salt
    received_data.password = bcrypt.hashSync(received_data.password, 10);
    const TIMESTAMP = moment(new Date()).utc().format('YYYY-MM-DD HH:mm:ss'); // creation date timestamp UTC
    received_data.created_date = TIMESTAMP;
    // -------------------------  Check if email already exists----------------------------
    try{
        let sql_check = 'SELECT * FROM `users` WHERE user_email LIKE \'' + received_data.email + '\'';
        let query_check = await DB_CONN.query(sql_check, (err, results) => {
            if(err){
                res.send(500);
                throw err;
            };
            if(results.length > 0){
                res.statusMessage = "Account with that email address already exist!";
                res.send(400);
            } else {
                // if email does not exist write data to DB
                    // ------------------------- INSERT USER ---------------------------------------------
                    let sql = 'INSERT INTO users SET ?';
                    let validTill= new Date()
                    let tokenForNewUser = generateRandomToken();
                    validTill.setDate(validTill.getDate() + 2) //VALID FOR 2 DAYS
                    let insert_query = DB_CONN.query(sql, 
                                        {
                                            user_email  : received_data.email,
                                            user_registered : true,
                                            pwd_hash    : received_data.password ,
                                            created_date: received_data.created_date,
                                            confirmation_token : tokenForNewUser,
                                            confirmation_date_time_valid_till : moment(validTill).utc().format('YYYY-MM-DD HH:mm:ss'),
                                            confirmed_status : false,
                                            deleted : false,
                                            email_verified : 0,
                                            receive_email_regulary : 0,
                                        },
                                        (err, result) =>
                        {
                        if(err){
                            res.statusMessage("There was a problem with the server, to connect to it's database. Please try later when the problem is resolved.");
                            res.send(500);
                            return;
                            }
                            EMAIL_SENDER.sendRegisterConfEmail(tokenForNewUser, received_data.email );
                            res.status(200).send("register success");
                        });//end insert_query*/
            } // else end;
        }); // end query_check;
    } catch (err){
        console.log(err);
    }

});

generateRandomToken = () =>{
    let tokenLength = 30;
    let text = "";
    let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      
    for (let i = 0; i < tokenLength; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));
      
        return text;
}

/*********************************************************************************************************
 *  /logout
 *********************************************************************************************************/
router.post('/logout' , async (req, res) => {

    req.session.destroy(err => {
        if (err){
            res.statusMessage = "There was a problem trying to log you out of the system.";
            res.status(500).end();
            return null
        }
        res.clearCookie(SESSION_VARIABLES.SESSION_NAME)
        res.send("logout")
        })
});


/*********************************************************************************************************
 *  /isLogged
 *********************************************************************************************************/
router.post('/isLogged' , async (req, res) => {
    if(req.session.uemail){
        res.json({logged : true});
    } else{
        res.json({logged : false});
    }
});

/*********************************************************************************************************
 *  MAIN EDIT REMINDER
 *********************************************************************************************************/
/*********************************************************************************************************
 *  /get-email-from-token
 * get email from edit main token
 *********************************************************************************************************/
router.post('/get-email-from-token' , async (req, res) => {
    try{
        let sql_check = `
        SELECT
            users.user_email 
        FROM
            users INNER JOIN reminders 
            ON users.id_user = reminders.id_user
        WHERE
            reminders.edit_token = '${req.body.token}'
            AND reminders.deleted_stopped = 0
            AND users.deleted = 0
            AND users.confirmed_status = 0
         `;

         let query_check = await DB_CONN.query(sql_check, (err, result) => {
            if(err){
                res.send(500);
                throw err;
            };
            if(result.length > 0){
                res.send(result);
                return;
            }
        }) // query_check end;
    } catch(exception){
        console.log(exception);
        res.status(500).send("ERROR");
    }
});
/*********************************************************************************************************
 *  /register-existing-acc
 *********************************************************************************************************/
router.post('/register-existing-acc' , async (req, res) => {
    let rdata = {
        email:        req.body.email,
        password:     req.body.password
    }
    // ------------------------------------------ check if email is in a valid format ------------------
    // and if password is empty
    isEmail = isEmailAndPasswordNotValid(rdata.email, rdata.password);
    
    if(isEmail){
        res.statusMessage = isEmail.toString(); // list of errors
        res.send(400);
    }
    const emailtoken = generateRandomToken();
    // Hash the password with the salt
    rdata.password = bcrypt.hashSync(rdata.password, 10);
    let sql_update =`
        UPDATE
            users 
        SET  
            pwd_hash  = '${rdata.password}' ,
            confirmation_token = '${emailtoken}',
        WHERE 
            user_email = ${rdata.email}
            AND users.deleted = 0;
            `;
    let query = DB_CONN.query(sql_query, (err, result) => {
        if(err){
            console.log(err);
            res.sendStatus(500);
            return;
        }
        EMAIL_SENDER.sendRegisterConfEmail(emailtoken, rdata.email );
        res.send(200);
    });    
});

module.exports = router;