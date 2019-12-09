const mysql = require('mysql');
const DB_CONN = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '',
    database : 'remind-me' 
})

module.exports = DB_CONN;