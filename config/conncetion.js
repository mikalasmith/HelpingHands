var mysql = require("mysql");

var connection
if (process.env.JAWSDB_URL){
    connection = mysql.createConnection(process.env.JAWSDB_URL);
}
else{
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "d60061981D", 
    database:"volorg"
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
