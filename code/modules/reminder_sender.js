const moment = require('moment');
const DB_CONN = require('../data_variables/db_info');
const EMAIL_SENDER = require('../modules/email_sender');


function calculateNextDate(dbDate, dbTime, dbEvery , dbDDifference ){
    let newNextDate = new Date(dbDate);
    let tSplit = dbTime.split(":");
    newNextDate.setHours(tSplit[0]);
    newNextDate.setMinutes(tSplit[1]);
    newNextDate.setMilliseconds(tSplit[2]);

    switch(dbEvery){
        case 'week':
            newNextDate.setDate(newNextDate.getDate() + 7);
            break;
        case 'forthnight':
            newNextDate.setDate(newNextDate.getDate() + 14);
            break;
        case 'month':
            newNextDate.setDate(newNextDate.getDate() + 30);
            break;
        case 'onceoff':
            newNextDate.setDate(newNextDate.getDate() + 0);
            break;
        case 'custom':
            newNextDate.setDate(newNextDate.getDate() + Number(dbDDifference));
            break;
    }
    return newNextDate;

}

const sendTextPhoneReminder = () =>{
    console.log("Sending Phone Reminder....");
}

const sendCalendarReminder = () =>{
    console.log("Sending Calendar Reminder...");
}

const sendSlackReminder = () =>{
    console.log("Sending Slack Reminder");
}


exports.checkAndIfNeededSendOutReminders = async () =>{
    // we want to search from our database between current date and time and -5mins date and time
    let thisDate = new Date();
    let currentDate1 = new Date(thisDate.toUTCString())//new Date(thisDate.toUTCString())
    currentDate1.setMinutes(thisDate.getUTCMinutes());
    currentDate1.setHours(thisDate.getUTCHours());

    thisDate.setMinutes(thisDate.getMinutes() - 5);
    let currentDate2 = new Date(thisDate.toUTCString());
    currentDate2.setMinutes(thisDate.getUTCMinutes());
    currentDate2.setHours(thisDate.getUTCHours());

    // contact the DB and get reminders to send emails to
    try{
        let sql_q = `
        SELECT
            users.user_email AS email,
            users.user_phone AS phone,
            users.user_slack AS slack,
            reminders.remind_by,
            reminders.title_reminder,
            reminders.every,
            reminders.next_date,
            reminders.time,
            reminders.day_difference_between_reminders,
            reminders.reminder_text,
            id_reminder

        FROM reminders
        INNER JOIN users ON reminders.id_user = users.id_user
        WHERE (next_date BETWEEN '${moment(currentDate2).format('YYYY-MM-DD')}' AND '${moment(currentDate1).format('YYYY-MM-DD')}')
        AND time BETWEEN '${moment(currentDate2).format('HH:mm:ss')}' AND '${moment(currentDate1).format('HH:mm:ss')}'
        AND users.email_verified = TRUE
        AND users.deleted = FALSE
        AND reminders.deleted_stopped = FALSE
        AND reminders.approved = TRUE
        AND users.receive_email_regulary = 1;
                `;
        let query_check = await DB_CONN.query(sql_q, (err, results) => {
            if(err) {return;};
            if(results.length > 0){
                //If we need to send out the reminder
                results.forEach((db_data) =>{                    
                    //check every field = where to send reminders? phone, email, slack, calendar
                    //call function to send out the reminder
                    if(db_data.remind_by === 'text'){
                        sendTextPhoneReminder();
                    } else if(db_data.remind_by === 'email'){
                        EMAIL_SENDER.sendEmailReminder(db_data.email , db_data.title_reminder, db_data.reminder_text);
                    }else if(db_data.remind_by === 'calendar'){
                        sendCalendarReminder();
                    }else if(db_data.remind_by === 'slack'){
                        sendSlackReminder();
                    }
                    let newNextDate = calculateNextDate(
                        db_data.next_date,
                        db_data.time,
                        db_data.every,
                        db_data.day_difference_between_reminders,
                    );
                    //update next date

                    let sql_q_update = `
                    UPDATE reminders 
                    SET  
                        next_date   = '${moment(newNextDate).format('YYYY-MM-DD')}',
                        time        = '${moment(newNextDate).format('HH:mm:ss')}'
                    WHERE 
                        id_reminder = ${db_data.id_reminder}`;
                    
                    let query = DB_CONN.query(sql_q_update, (err, result) => {
                        if(err){ console.log(err);}
                    });
                });
            }
        });
    } catch (err){
        console.log(err)
    }
}