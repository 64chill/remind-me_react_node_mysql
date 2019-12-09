const express = require('express');
const bcrypt = require('bcrypt');
const moment = require('moment');
const router = express.Router();
const DB_CONN = require('../../data_variables/db_info');
const EMAIL_SENDER = require("../../modules/email_sender");

router.post('/create' , async (req, res) => {
    /*if(!isLogged){
        res.statusMessage = "Unathorized : Please First Login";
        res.send(401);
    }*/

    let received_data = {
        email               :req.body.email,
        password            :req.body.password,
        remind_by           :req.body.remind_by         ?req.body.remind_by:false ,
        title_reminder      :req.body.title_reminder    ,
        every               :req.body.every             ?req.body.every:false ,
        start_date          :req.body.start_date        ?req.body.start_date:false ,
        time                :req.body.time              ?req.body.time:false ,
        reminder_text       :req.body.reminder_text     ,
        day_difference_between_reminders    :req.body.day_difference_between_reminders ?req.body.day_difference_between_reminders:undefined ,
        nextDate            :req.body.nextDate
    }

    /******************************************************************************** */
    //check if password is not sent
    if (received_data.password === ""){
        let newBool = await createReminderForNonRegisteredUsers(received_data);

        console.log(newBool)
        if(newBool){
            res.send(200);
            return;
        } else{
            res.status(500).send("There was a problem trying to create your reminder");
            return;
        }
    }
    /******************************************************************************** */
    
    //if (received_data.singup){
        /*if email & password & checkbox -> create an account
        + if validate if real email && password length
            + create new account, GET ID 
                -> send conf email valid 24h to confirm the account & reminder
                -> after confirmation
            - send error message to show on front-end*/
    //} else {
        /*
    if email & password inserted -> check login details
        +   get ID
        -   send error message to show on front-end*/
    if (received_data.email!="" && received_data.password!=""){
        let sql_check = 'SELECT id_user, pwd_hash FROM `users` WHERE user_email LIKE \'' + received_data.email + '\' AND users.deleted = 0 AND users.confirmed_status = 1';
        let query_check = await DB_CONN.query(sql_check, (err, results) => {
            if(results.length > 0){
               //check password if correct
                let pwdHash = results[0]['pwd_hash'];
                bcrypt.compare(received_data.password, pwdHash, function(err, res_db) {
                    if(!res_db){
                        res.statusMessage = "Authentification Failed";
                        res.sendStatus(400);
                        return;
                    }
                // create a new reminder
                let userID = results[0]['id_user'];
                let insertInto_object = createNewReminderInsertParams(received_data, userID );
                let sqlInsert = 'INSERT INTO reminders SET ?';
                let insert_query = DB_CONN.query(
                    sqlInsert, 
                    insertInto_object,
                    (err, result) =>
                        {
                        if(err){
                            console.log(err)
                            
                            res.statusMessage = "There was a problem with the server, to connect to it's database. Please try later when the problem is resolved.";
                            res.sendStatus(500);
                            return
                        }
                        res.sendStatus(200);
                        return
                    });

                }); //  bcrypt.compare end;
            } 
            else {
                res.statusMessage = "Unathorized : Invalid E-mail and/or Password";
                res.sendStatus(401);
                return
            }
        })

    } else {
        res.statusMessage = "Unathorized : Please First Login";
        res.sendStatus(401);
        return
    }

    //}
    /*if only email
        check if user exists && not registered : 
            +   send conf email
            -   send error msg to the user

    */
    //todo check if user with this email exists
    // if it exists get user ID to insert into reminder |
    // if not -> password inserted?
    //TODO VALIDATE FIELDS
    //TODO SEE WHAT TO DO WITH EMAIL, PASSWORD : LOGIN/REGISTER FROM HERE???! - NON REG USERS
   
});
/*********************************************************************************************************
 *  /approve
 *********************************************************************************************************/
router.post('/approve' , async (req, res) => {
    if(!isLogged()){
        res.statusMessage = "Unathorized : Please First Login";
        res.send(401);
    }
    let received_data = {
        id_reminder : req.body.id_reminder,
        approved     : req.body.approve
    }
    //TODO validate : see what else to implement
    let sql_query = `UPDATE reminders SET approved  = ${received_data.approved} WHERE id_reminder = ${received_data.id_reminder}`;
    let query2 = DB_CONN.query(sql_query, (err, result) => {
        if(err){
            res.statusMessage = "Ops, there was a problem trying to change approved state of the reminder!";
            res.sendStatus(500);
        }
        res.sendStatus(200);
    });

});

/*********************************************************************************************************
 *  /edit
 *********************************************************************************************************/
router.post('/edit' , async (req, res) => {
    let uID;
    if(!isLogged()){
            if (req.body.id_user ){
                uID = req.body.id_user
            } else{
                uID = req.session.uid;
            }        
    } else {
        res.statusMessage = "Unathorized : Please First Login";
        res.send(401);
        return;
    }  
    //let sql_query = `UPDATE reminders SET title_reminder  = '${req.body.title}', reminder_text = '${req.body.text}', approved = ${req.body.approved}, next_date = '${req.body.next_date}', remind_by = '${req.body.remind_by}', every = '${req.body.every}', time = '${req.body.time}', day_difference_between_reminders = ${req.body.day_difference ?req.body.day_difference:null} WHERE  id_user = ${req.session.uid} AND id_reminder=${req.body.id_reminder}`;
    //${req.session.uid}
    let sql_query = `UPDATE reminders 
    SET  
        title_reminder  = '${req.body.title}',
        reminder_text = '${req.body.text}',
        approved = ${req.body.approved},
        next_date = '${req.body.next_date}',
        remind_by = '${req.body.remind_by}',
        every = '${req.body.every}',
        time = '${req.body.time}',
        day_difference_between_reminders = ${req.body.day_difference ?req.body.day_difference:null}
    WHERE 
        id_user = ${uID} AND 
        id_reminder=${req.body.id_reminder}`;
    let query = DB_CONN.query(sql_query, (err, result) => {
        if(err){ res.send(500);return;}
        if(result){
            res.send(200);return;
        }
    });
});

/*********************************************************************************************************
 *  /gatall-specific-user
 *********************************************************************************************************/
router.post('/gatall-specific-user' , async (req, res) => {
    //if session is not set
    if (!req.session.uid){
        res.statusMessage = "Unathorized : Please First Login";
        res.send(401);
        return;
    }

    sql_query = 'SELECT id_reminder, title_reminder AS \'title\', every , reminder_text AS \'text\' , next_date, time,approved, remind_by , day_difference_between_reminders AS "day_difference"  FROM reminders WHERE id_user =  \'' + req.session.uid + '\' AND deleted_stopped = 0';
    let query_check = await DB_CONN.query(sql_query, (err, result) => {
        if(err) throw err;
        if(result.length > 0){
            res.send(result);
            return;
        }
    });
});

/*********************************************************************************************************
 *  /get-reminder-edit-token/:user_token
 *********************************************************************************************************/
router.get('/get-reminder-edit-token/:edit_token' , async (req, res) => {
    //check if token is valid
    // if token is valid return in the nice format information about the reminder
    //send that info to the client
    let currentTIME = new Date()
    sql_query = `
        SELECT
            reminders.id_user,
            reminders.id_reminder AS 'id',
            title_reminder AS \'title\',
            every , reminder_text AS \'text\',
            next_date,
            time,
            approved,
            remind_by,
            day_difference_between_reminders AS "day_difference" 
        FROM
            approved_emails_to_edit_reminders INNER JOIN reminders 
            ON approved_emails_to_edit_reminders.id_reminder = reminders.id_reminder
        WHERE
            approved_emails_to_edit_reminders.reminders_token = '${req.params.edit_token}'
            AND approved_emails_to_edit_reminders.reminders_token_valid_till >= '${moment(currentTIME).utc().format('YYYY-MM-DD HH:mm:ss')}'
            AND reminders.deleted_stopped = 0;`;
        let query_check = await DB_CONN.query(sql_query, (err, result) => {
            if(err){
                res.send(500);
                throw err;
            };
            if(result.length > 0){
                res.send(result);
                return;
            }
        });
});
/*********************************************************************************************************
 *  /post-reminder-edit
 * for edit from the main email
 *********************************************************************************************************/
router.post('/post-reminder-edit' , async (req, res) => {
    let currentTIME = new Date()
    sql_query = `
    SELECT
        reminders.id_user,
        reminders.id_reminder AS 'id',
        title_reminder AS \'title\',
        every , reminder_text AS \'text\',
        next_date,
        time,approved,
        remind_by,
        day_difference_between_reminders AS "day_difference" 
    FROM
        reminders INNER JOIN users 
        ON reminders.id_user = users.id_user
    WHERE
        reminders.edit_token = '${req.body.token}'
        AND reminders.deleted_stopped = 0
        AND users.deleted = 0
        AND users.confirmed_status = 0;`;
        
        let query_check = await DB_CONN.query(sql_query, (err, result) => {
            if(err){
                res.send(500);
                throw err;
            };
            if(result.length > 0){
                res.send(result);
                return;
            } else{
                res.send(400);
            }
        });
});

/*********************************************************************************************************
 *  /remove-reminder
 *********************************************************************************************************/
router.post('/remove-reminder' , async (req, res) => {
    //if session is not set
    if (!req.session.uid){
        res.statusMessage = "Unathorized : Please First Login";
        res.sendStatus(401);
        return;
    }
    try{
        let sql_query = `UPDATE reminders 
        SET  
        deleted_stopped  = TRUE
        WHERE 
            id_user = ${req.session.uid} AND 
            id_reminder=${req.body.id_reminder}`;
        
        let query = DB_CONN.query(sql_query, (err, result) => {
            if(err){
                console.log(err);
                res.sendStatus(500);
                return;
            }
            let sql_update2 = `
            UPDATE approved_emails_to_edit_reminders
            SET email_deleted = TRUE
            WHERE 
            id_reminder = ${req.body.id_reminder}`;
        
            let query2 = DB_CONN.query(sql_update2, (err, result) => {
                if(err){
                    console.log(err);
                    res.sendStatus(500);
                    return;
                }
                res.sendStatus(200);
                return
            });
        });
    } catch(err){
        console.log("err " + err)
        res.status(500).send("There was a problem");
        return;
    }
});

/*********************************************************************************************************
 *  /list-approved-emails
 *********************************************************************************************************/
router.post('/list-approved-emails' , async (req, res) => {
    //if session is not set
    if (!req.session.uid){
        res.statusMessage = "Unathorized : Please First Login";
        res.sendStatus(401);
        return;
    }
    
    let sql_query = `
    SELECT
        approved_emails_to_edit_reminders_id,
        approved_emails_to_edit_reminders.email,
        reminders.id_reminder,
        title_reminder AS "title"
    FROM
        approved_emails_to_edit_reminders INNER JOIN reminders
        ON reminders.id_reminder = approved_emails_to_edit_reminders.id_reminder
        INNER JOIN users ON users.id_user = reminders.id_user
    WHERE 
        users.id_user = ${req.session.uid}
        AND email_deleted = FALSE
        AND users.deleted = 0
        AND users.confirmed_status = 1`;
    
    let query = await DB_CONN.query(sql_query, (err, result) => {
        if(err){
            res.status(500).send("There was a problem");
            return;
        }
        if(result.length > 0){
            res.send(result);
            return;
        }else {
            res.status(401).send("Data could not be found for this request.");
            return;
        }
    });
});

/*********************************************************************************************************
 *  /remove-approved-email
 *********************************************************************************************************/
router.post('/remove-approved-email' , async (req, res) => {
    //if session is not set
    if (!req.session.uid){
        res.statusMessage = "Unathorized : Please First Login";
        res.sendStatus(401);
        return;
    }
    let sql = `
        UPDATE approved_emails_to_edit_reminders 
            INNER JOIN reminders
                ON reminders.id_reminder = approved_emails_to_edit_reminders.id_reminder
        SET email_deleted = TRUE
        WHERE 
            approved_emails_to_edit_reminders_id = ${req.body.delID} AND
            reminders.id_user = ${req.session.uid}`;
    let query = DB_CONN.query(sql, (err, result) => {
        if(err){
            console.log(err)
            res.status(500).send("Delete Account Failed");
            return;         
        };
        res.send('Email Deleted');
        return;
    });
});

/*********************************************************************************************************
 *  /add-new-approve-email
 *********************************************************************************************************/
router.post('/add-new-approve-email' , async (req, res) => {
    //if session is not set
    if (!req.session.uid){
        res.status(401).send("Unathorized : Please First Login");return;
    }
    try{
        let sql_check = `
         SELECT * 
            FROM approved_emails_to_edit_reminders
         WHERE
            id_reminder = ${req.body.reminderid}
            AND email = '${req.body.email}' AND
            email_deleted = FALSE
         `;

         let query_check = await DB_CONN.query(sql_check, (err, results) => {
            if(err) throw err;
            if(results.length > 0){
                res.status(500).send("Email is already added for that reminder");
                return;
            } else {
                    let newToken = generateRandomToken();
                    let validTill= new Date();
                    validTill.setDate(validTill.getDate() + 30) //VALID FOR 30 DAYS
                    let sql_insert = `
                    INSERT INTO approved_emails_to_edit_reminders
                    SET ?`;

                    let insert_query = DB_CONN.query(sql_insert, 
                        {
                            email  : req.body.email,
                            id_reminder  : req.body.reminderid,
                            email_deleted :false,
                            reminders_token : newToken ,
                            reminders_token_valid_till: moment(validTill).utc().format('YYYY-MM-DD HH:mm:ss'),
                        },
                        (err, result) =>
                    {
                    if(err){
                        console.log(err)
                        res.status(500).send("There was a problem, pelase try again");
                        return;
                    }
                    EMAIL_SENDER.sendTokenNewApprovedEditEmail(newToken,req.body.email, req.body.reminderid);
                    //EMAIL_SENDER.sendTokenNewApprovedEditEmail(newToken,req.body.email);
                    res.status(200).send("success");
                    return;
                    });//end insert_query
            }
        }); // query_check end
    } catch(err){
        console.log(err);
        res.status(500).send("There was a problem");
        return
    }
});

/*********************************************************************************************************
 *  /get-unapproved-maxnum
 *********************************************************************************************************/
router.post('/get-unapproved-maxnum' , async (req, res) => {
    try{
        let sql_check = `
            SELECT unapproved_non_registered_users AS 'maxnum' FROM init_settings
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
 *  /unsubscribe-all
 *********************************************************************************************************/
router.post('/unsubscribe-all' , async (req, res) => {
    try{
        let sql_query = `
        UPDATE 
            users
        SET
            receive_email_regulary  = 0
        WHERE
            id_user = (
			SELECT id_user FROM reminders 
            WHERE edit_token = '${req.body.token}');`;
    let query2 = DB_CONN.query(sql_query, (err, result) => {
        if(err){
            res.send(500);return;
        }
        res.sendStatus(200);return;
    });
    } catch(exception){
        console.log(exception);
        res.status(500).send("ERROR");
    }
});
/*********************************************************************************************************
 *  /unsubscribe-all
 *********************************************************************************************************/
router.post('/unsubscribe-specific-reminder' , async (req, res) => {
    try{
        let sql_query = `
        UPDATE 
            REMINDERS
        SET
            approved  = 0
        WHERE
            edit_token = '${req.body.token}'`;
    let query2 = DB_CONN.query(sql_query, (err, result) => {
        if(err){
            res.send(500);
        }
        res.sendStatus(200);
    });
    } catch(exception){
        console.log(exception);
        res.status(500);
    }
});

/*********************************************************************************************************
 *  /is-unapproved-reminders-max-reached-nonregistered
 *********************************************************************************************************/
router.post('/is-unapproved-reminders-max-reached-nonregistered' , async (req, res) => {
    //req.body.token : can be either a token representation or an email representation
    if(req.body.email){
        sql_check = `
        SELECT
            count(id_reminder) AS 'count',
            unapproved_non_registered_users as 'num'
        FROM 
            reminders INNER JOIN users
            ON reminders.id_user = users.id_user ,
            init_settings
        WHERE
            users.id_user = (
            SELECT id_user FROM users 
            WHERE user_email = '${req.body.email}'
            GROUP BY id_user)
            AND reminders.approved = FALSE
        GROUP BY
        	unapproved_non_registered_users;
         `;
    }
    if (req.body.token){
        sql_check = `
        SELECT
            count(id_reminder) AS 'count',
            unapproved_non_registered_users as 'num'
        FROM 
            reminders INNER JOIN users
            ON reminders.id_user = users.id_user ,
            init_settings
        WHERE
            users.id_user = (
                SELECT id_user FROM reminders 
                WHERE edit_token = '${req.body.token}')
            AND reminders.approved = FALSE
        GROUP BY
        	unapproved_non_registered_users
         `;
    }
    try{
         let query_check = await DB_CONN.query(sql_check, (err, result) => {
            if(err){
                res.send(500);
                console.log(err)
                throw err;
            };
            if(result.length > 0){
               if (result[0].count === 0  && result[0].num === null ){
                   //email not registered or not in the DB
                   res.send("false");
                   return;
               }
               if ( result[0].num <= result[0].count){
                   res.send("true");
                   return;
               } else {
                res.send("false");
                return;
               }
            }
        }) // query_check end;
    } catch(exception){
        console.log(exception);
        res.status(500).send("ERROR");
    }
});

/*********************************************************************************************************
 *  /is-token-expired
 *********************************************************************************************************/
router.post('/is-token-expired' , async (req, res) => {
    let currentTIME = new Date();
    try{
        let sql_check = `
        SELECT
            id_reminder
        FROM
            reminders
        WHERE
            edit_token_date_time_valid_till >= '${moment(currentTIME).utc().format('YYYY-MM-DD HH:mm:ss')}'
            AND edit_token = '${req.body.token}'
         `;
         let query_check = await DB_CONN.query(sql_check, (err, result) => {
            if(err){
                res.send(500);
                throw err;
            };
            if(result.length > 0){
                   res.send(200);
                   return;
               } else {
                   res.send(400);
               }
        }) // query_check end;
    } catch(exception){
        console.log(exception);
        res.status(500).send("ERROR");
    }
});


/*********************************************************************************************************
 *  F U N C T I O N S
 *********************************************************************************************************/

generateRandomToken = () =>{
    let tokenLength = 30;
    let text = "";
    let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      
    for (let i = 0; i < tokenLength; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));
        return text;
}

/******************************* additional functions to make our code look cleaner a bit ***************/
isLogged = (req) =>{
    try{
        if(req.session.uid){
            return true;
        } else{
            return false;
        }
    } catch (err){
        return false;
    }
}

/*********************************************************************************************************
 *  /create
 *********************************************************************************************************/

 function createNewReminderInsertParams(received_data,  userID){
    insertInto_object = {
        id_user : userID,//req.session.uid,
        title_reminder : received_data.title_reminder,
        reminder_text : received_data.reminder_text,
        approved : 0,
        next_date: received_data.nextDate,
        deleted_stopped : false,
    }
    //if inputs are provided add them to the object then to database
    received_data.remind_by     ? insertInto_object.remind_by        = received_data.remind_by  : null;
    received_data.every         ? insertInto_object.every            = received_data.every      : null;
    received_data.start_date    ? insertInto_object.start_date       = received_data.start_date : null;
    received_data.time          ? insertInto_object.time             = received_data.time       : null;
    received_data.time ? insertInto_object.day_difference_between_reminders = received_data.day_difference_between_reminders : null;
    return insertInto_object;
 }

createReminderForNonRegisteredUsers = async (received_data) => {
    return new Promise(async function(resolve, reject) {
        try{
            let sql_check = `
            SELECT 
                id_user, user_registered, email_verified , confirmation_date_time_valid_till
            FROM
                users
            WHERE
                user_email = '${received_data.email}'
            `;
            let query_check = await DB_CONN.query(sql_check, (err, results) => {
                let uID = -1;
                let currentDate = new Date();
                if(err){
                    console.log(err);
                    resolve(false);
                };
                if(results.length > 0){
                    if(results[0]['user_registered'] === 0){
                        uID = results[0]['id_user']
                    } else{
                        resolve(false);
                    }
                    if (results[0]['email_verified'] === 0){
                        //TODO check if token date expired
                        // if expired send out new token to that email address
                        let resultDate = new Date(results[0]['confirmation_date_time_valid_till']);
                        if(currentDate.toUTCString() >= resultDate.toUTCString() ){
                        }                    
                    }
                } // results.length > 0 sql_check end
                    if(uID === -1 ){
                        // ------------------------- INSERT USER ---------------------------------------------
                        let new_user_sql = 'INSERT INTO users SET ?';
                        let validTill= new Date()
                        let creationDate= new Date()
                        let tokenForNewUser = generateRandomToken();
                        validTill.setDate(validTill.getDate() + 2) //VALID FOR 2 DAYS
                        let insert_query = DB_CONN.query(new_user_sql, 
                                            {
                                                user_email  : received_data.email,
                                                user_registered : 0,
                                                created_date: moment(creationDate).utc().format('YYYY-MM-DD HH:mm:ss'),
                                                confirmation_token : tokenForNewUser,
                                                confirmation_date_time_valid_till : moment(validTill).utc().format('YYYY-MM-DD HH:mm:ss'),
                                                confirmed_status : 0,
                                                deleted : 0,
                                                email_verified : 0,
                                                receive_email_regulary : 0,
                                            },
                        (err, insert_result) =>{
                            if(err){
                                resolve(false);
                            }
                                EMAIL_SENDER.sendRegisterConfEmail(tokenForNewUser, received_data.email)
                                uID = insert_result.insertId;
                                createRemindMeNonRegUsers(uID,received_data, received_data.email );
                                resolve(true);
                            });//end insert_query*/
                } // if(uID === -1 ){ end 
                else {
                    createRemindMeNonRegUsers(uID,received_data, received_data.email );
                    resolve(true);
                }
            }); // end query_check;
        } catch (err){
            resolve(false);
            console.log(err);
        }
    }); // return new Promise(f end;
}

createRemindMeNonRegUsers = async (uID,received_data, emailIN) => {
    try{
        let insertInto_object = createNewReminderInsertParams(received_data, uID );
        let validTokenTill= new Date();
        validTokenTill.setDate(validTokenTill.getDate() + 2);
        insertInto_object["edit_token"] = generateRandomToken();
        insertInto_object["edit_token_date_time_valid_till"] = moment(validTokenTill).utc().format('YYYY-MM-DD HH:mm:ss');
        console.log("tryyyyy")
        let sqlInsert = 'INSERT INTO reminders SET ?';
                    let insert_query = DB_CONN.query(
                        sqlInsert, 
                        insertInto_object,
                        (err, result) =>
                            {
                            if(err){
                                console.log(err)
                                return false;
                            }
                            console.log(result);
                            EMAIL_SENDER.sendCreatedReminderEmailToNonRegisteredUsers(insertInto_object.edit_token ,emailIN )
                            return true;
                        }); // insert_query end;
    } catch(err){
        console.log(err)
        return false;
    }
}
module.exports = router;