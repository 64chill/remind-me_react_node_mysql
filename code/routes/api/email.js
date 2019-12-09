const express = require('express');
const bcrypt = require('bcrypt');
const moment = require('moment');
const nodemailer = require('nodemailer');
const app = express();
const router = express.Router();
const SESSION_VARIABLES = require('../../data_variables/session_info');
const DB_CONN = require('../../data_variables/db_info');


/*********************************************************************************************************
 *  /confirm/account
 *********************************************************************************************************/
router.get('/confirm/account/:user_token' , async (req, res) => {
    console.log("here")
    let currentTIME = new Date()
    try{
        let sql_q = `SELECT id_user
        FROM users
        WHERE confirmation_token = '${req.params.user_token}'
        AND confirmed_status = FALSE
        AND confirmation_date_time_valid_till >= '${moment(currentTIME).utc().format('YYYY-MM-DD HH:mm:ss')}'`;

        let query_check = await DB_CONN.query(sql_q, (err, results) => {
            if(err) {
                res.status(500).send("It seems that there is currently a problem of some sort");
                return
            };
            if(results.length > 0){
                const id_user = results[0]['id_user'];
                let sql_insert = `UPDATE users
                SET confirmed_status = TRUE,
                receive_email_regulary = 1
                WHERE id_user = ${id_user}`;
                let query2 = DB_CONN.query(sql_insert, (err, result) => {
                    if(err){
                        res.status(500).send("It seems that there is currently a problem of some sort!");
                        return
                    }
                    res.sendStatus(200);
                    return
                });
            } // if(results.length > 0){ end;
            else {
                res.status(400).send('Invalid Token! This can be caused if an account is already registered or if token is invalid or token has expired!');
                return
            }
        }); // query_check end;
    } catch (err){
        res.status(500).send("Please try again later!");
        return
    }
});

module.exports = router;