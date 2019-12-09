# remind-me_react_node_mysql

In the code folder do `npm install` then `npm start` to run the server
In the /code/client do `npm install` then `npm start` to start the React client or do `npm build` to build the project

Create database called remind-me (in case you create database with the different name change the database name serverside, as well as set differnt host, port, password etc -> /code/data_variables/db_info.js). Import the sql file callend remind-me.sql. 
Default params for login (a userthat has some test data on him):
 - username : example2@example.com
 - password : secret

 If you want the app to send out real emails in the folder /code/data_variables/email_info.js set the parameters to your smtp client via nodemailer. As well as change the sender email in /code/modules/email_sender.js, set the sender email as your own.

 Also if you want to test out the app in the real enviroment/production change the const MAIN_URL in the email in /code/modules/email_sender.js


REMIND ME
-----
 An App that lets you fill in the form about what you want to be notified about and set the app to send you email, phone text, slack or google calendar reminder. Currently only email sender works, for this set the parameters as said above.