const TRANSPORTER = require('../data_variables/email_info');
const DB_CONN = require('../data_variables/db_info');

const FROM_EMAIL = "russel44@ethereal.email";
const MAIN_URL = "http://localhost:3000";
//__________________________________________________________________________________________________
exports.sendEmailReminder = async (remailTO, rtitle, rtext) =>{
    let info = await TRANSPORTER.sendMail({
        from: FROM_EMAIL, // sender address
        to: remailTO,
        subject: "RemindMe Subscription Email : " + rtitle, // Subject line
        text: rtext, // plain text body
    }); 
}

//__________________________________________________________________________________________________
exports.sendRegisterConfEmail = async (token, mailTo) => {
    // send mail with defined transport object
    let info = await TRANSPORTER.sendMail({
        from: FROM_EMAIL, // sender address
        to: mailTo,//mailTo,//mailTo,
        subject: "Remindme : Confirm Registration", // Subject line
        //text: "Hello world?", // plain text body
        html: '<b>Please confirm your email</b>'+
        '<a href="'+MAIN_URL+'/email/confirm/' + token+'">click here to confirm</a>'
    });
}

//__________________________________________________________________________________________________
exports.sendTokenNewApprovedEditEmail = async (token, mailTo, reminderID) => {
    //get data for particular reminder from DB to write it to the user
    let sql_query_check = `SELECT title_reminder, users.user_email
    FROM  reminders INNER JOIN users ON reminders.id_user = users.id_user
    WHERE id_reminder = ${reminderID} AND users.deleted = 0
    `;
    let query_check = await DB_CONN.query(sql_query_check, async (err, result) => {
       if(result.length > 0){
       // send mail with defined transport object
   let info = await TRANSPORTER.sendMail({
       from: FROM_EMAIL, // sender address
       to: mailTo,
       subject: "Remindme : Enabled to edit Reminder", // Subject line
       //text: "Hello world?", // plain text body
       html: '<b>You are enabled to edit the reminder</b><br></br>'+
       +'<ul><li>Reminder title: '+result["user_email"]+'</li>'+
       +'<li>Email that approved you to edit: '+result["user_email"]+'</li></ul>'+
       '<a href="'+MAIN_URL+'/email/edit/reminder/' + token+'">click here to edit the reminder</a><br></br> Reminder is valid for 30days from receiving this email.'
   });    
       }
    });
}
//__________________________________________________________________________________________________
exports.sendCreatedReminderEmailToNonRegisteredUsers = async (token, mailTo) => {
    console.log(token)
    // send mail with defined transport object
    let info = await TRANSPORTER.sendMail({
        from: FROM_EMAIL, // sender address
        to: mailTo,//mailTo,//mailTo,
        subject: "You Just Created New RemindMe!", // Subject line
        //text: "Hello world?", // plain text body
        html: '<b>Here are helpful links below</b>'+
        '<a href="'+MAIN_URL+'/email/reminder/edit/' + token+'">Edit this reminde'+ '<br></br>'+
        '<a href="'+MAIN_URL+'/email/reminder/stop/' + token+'">Stop this reminde'+'<br></br>'+
        '<a href="'+MAIN_URL+'/email/reminder/stopall/' + token+'">Stop all remindme emails.'
    });
}