var mysql = require("mysql");
require('dotenv').config();

var connection
if (process.env.JAWSDB_URL){
    connection = mysql.createConnection(process.env.JAWSDB_URL);
}
else{
    // var connection = mysql.createConnection({
    //     root: 3306,
    //     host: "localhost",
    //     user: "root",
    //     password: process.env.password,
    //     database: "volorg",

    // });
    var connection = {
        port: 3306,
        host: "g8mh6ge01lu2z3n1.cbetxkdyhwsb.us-east-1.rds.amazonaws.com",
        user: "t5r7oqhkxtaryzbo",
        password: "aq8dlscmhcva99gz",
        database: "h0glcjw1dqi4evhz",

    };
};

connection.connect(function(err){
    if (err){
        console.log("error connection: " + err.stack);
        return;
    }
    console.log("connected as ID " + connection.threadId);
});

module.exports = connection;
