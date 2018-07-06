var mysql = require("mysql");
require('dotenv').config();

var connection
if (process.env.JAWSDB_URL){
    connection = mysql.createConnection(process.env.JAWSDB_URL);
}
else{
    var connection = mysql.createConnection({
        root: 3306,
        host: "localhost",
        user: "root",
        password: process.env.password,
        database: "volorg",

    });
};

connection.connect(function(err){
    if (err){
        console.log("error connection: " + err.stack);
        return;
    }
    console.log("connected as ID " + connection.threadId);
});

module.exports = connection;
