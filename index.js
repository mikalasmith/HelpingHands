var express = require("express");
var bodyParser = require("body-parser");
var bcrypt = require('bcrypt');
var path = require("path");
var app = express();
var cookieParser = require('cookie-parser')
app.use(express.static("public"));
var connection = require("./config/conncetion");
var PORT = process.env.PORT || 8080;
var passport = require("passport");
var LocalStrategy = require('passport-local').Strategy;
var expressValidator = require("express-validator");
var session = require("express-session");
var MySQLStore = require('express-mysql-session')(session);
var NodeGeocoder = require('node-geocoder');
var options = {
    provider: 'google',
    // Optional depending on the providers
    httpAdapter: 'https', // Default
    apiKey: 'YOUR_API_KEY', // for Mapquest, OpenCage, Google Premier
    formatter: null // 'gpx', 'string', ...
};
var geocoder = NodeGeocoder(options);
require('dotenv').config();

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(expressValidator());
app.use(cookieParser());

if (process.env.JAWSDB_URL){
    var options = {
        port: 3306,
        host: "g8mh6ge01lu2z3n1.cbetxkdyhwsb.us-east-1.rds.amazonaws.com",
        user: "t5r7oqhkxtaryzbo",
        password: "aq8dlscmhcva99gz",
        database: "h0glcjw1dqi4evhz",

    };
} else{
    // var options = {
    //     root: 3306,
    //     host: "localhost",
    //     user: "root",
    //     password: process.env.password,
    //     database: "volorg",

    // };
    var options = {
        port: 3306,
        host: "g8mh6ge01lu2z3n1.cbetxkdyhwsb.us-east-1.rds.amazonaws.com",
        user: "t5r7oqhkxtaryzbo",
        password: "aq8dlscmhcva99gz",
        database: "h0glcjw1dqi4evhz",

    };
    
}

var sessionStore = new MySQLStore(options);
app.use(session({
    secret: 'ghfghdf',
    resave: false,
    saveUninitialized: false,
    store: sessionStore
    // cookie: { secure: true }
}));
app.use(passport.initialize());
app.use(passport.session());
var exphbs = require("express-handlebars");
app.engine("handlebars", exphbs({
    defaultLayout: "main"
}));
app.set("view engine", "handlebars");
require("dotenv").config();
app.use(function (req, res, next) {
    try {
        res.locals.isAuthenticated = req.isAuthenticated();
    } catch (e){
        console.log(e)
    }
    
    next()
})
passport.use(new LocalStrategy(
    function (username, password, done) {
        console.log(username);
        console.log(password);
        connection.query("SELECT user_id, password FROM users WHERE username = ?", [username],
            function (err, result, fields) {
                if (err) {
                    done(err)
                };
                console.log("____________________________________")
                //   console.log(result);
                if (result.length === 0) {
                    done(null, false);
                } else {
                    var hash = result[0].password.toString().replace(/\0/g, '');

                    console.log(password === hash, password == hash, password + " " + hash)
                    //console.log(hash);
                    if (password === hash) {
                        return done(null, {
                            user_id: result[0].user_id
                        });
                    } else {
                        return done(null, false)
                    }

                }

            })
    }
));



app.get("/", function (req, res) {
    console.log(req.user);
    console.log(req.isAuthenticated());
    res.render("home", {
        title: "Home page"
    })
})


app.get("/singup", function (req, res) {
    res.render("index", {
        title: "Registration form"
    })
})

app.get("/profile", authenticationMiddleware(), function (req, res) {
    const id = req.user.user_id;
    // var query = "SELECT * FROM users WHERE user_id=" + id;
    var query = "SELECT users.username, users.email, opportunities.orgname, opportunities.orgname, opportunities.date, opportunities.numvol, opportunities.city, opportunities.address, opportunities.state, opportunities.zipcode, opportunities.description FROM users INNER JOIN opportunities ON users.user_id=opportunities.user_id WHERE users.user_id=3";

    connection.query(query, function (error, result) {
        if (error) throw error
        var data = result;
        console.log(data)
        if (result.length <= 0) {
            // var query = "SELECT * FROM users WHERE user_id=" + id;
            var query = "SELECT matching.user_id, matching.opp_id, opportunities.orgname, opportunities.orgname, opportunities.date, opportunities.numvol, opportunities.city, opportunities.address, opportunities.state, opportunities.zipcode, opportunities.description, users.username, users.email FROM matching INNER JOIN users ON matching.user_id=users.user_id INNER JOIN opportunities ON matching.opp_id=opportunities.opp_id  WHERE users.user_id=" + id;
            connection.query(query, function (error, result) {
                console.log("_____________________")
                console.log(result)
                if (result.length <= 0) {
                    var query = "SELECT * FROM users WHERE user_id=" + id;
                    connection.query(query, function (error, result2) {
                        if (error) throw error
                        res.render("profile", {
                            title: "Profile",
                            username: result2[0].username,
                            email: result2[0].email
                        })
                    })
                } else {
                    if (error) throw error

                    var count = 0;
                    var arr = []
                    for (var i = 0; i < result.length; i++) {
                        count++
                        var data = result[i];
                        var oppObject = {
                            orgname: data.orgname,
                            date: data.date,
                            numvol: data.numvol,
                            address: data.address,
                            city: data.city,
                            state: data.state,
                            zipcode: data.zipcode,
                            description: data.description,
                            count: count,
                            id: data.opp_id
                        }
                        arr.push(oppObject)

                    }
                    console.log(result)
                    res.render("profile", {
                        title: "Here is opportunity that yoou singed up for:",
                        arr,
                        username: result[0].username,
                        email: result[0].email
                    })
                }
            })
        } else {

            // res.render("profile", {
            //     title: "profile", 
            //     username: data[0].username, 
            //     email:data[0].email, 
            //     orgname: data.orgname,
            //     date: data.date,
            //     numvol: data.numvol,
            //     address: data.address,
            //     city: data.city,
            //     state:data.state,
            //     zipcode: data.zipcode,
            //     description: data.description,
            // })
            var count = 0;
            var arr = []
            for (var i = 0; i < result.length; i++) {
                count++
                var data = result[i];
                var oppObject = {
                    orgname: data.orgname,
                    date: data.date,
                    numvol: data.numvol,
                    address: data.address,
                    city: data.city,
                    state: data.state,
                    zipcode: data.zipcode,
                    description: data.description,
                    count: count,
                    id: data.opp_id
                }
                arr.push(oppObject)

            }
            res.render("profile", {
                title: "Your profile:",
                arr,
                username: result[0].username,
                email: result[0].email
            })
        }
    })

})
app.get("/opportunities", function (req, res) {
    res.render("opportunities", {
        title: "Opportunities"
    })
})
app.get("/view_all_opportunity", function (req, res) {
    var query = "Select * from opportunities"
    connection.query(query, function (error, result) {
        if (error) throw error
        var count = 0;
        var arr = []
        for (var i = 0; i < result.length; i++) {
            count++
            var data = result[i];
            var oppObject = {
                orgname: data.orgname,
                date: data.date,
                numvol: data.numvol,
                address: data.address,
                city: data.city,
                state: data.state,
                zipcode: data.zipcode,
                description: data.description,
                count: count,
                id: data.opp_id,
                user_id: req.user.user_id,
            }
            arr.push(oppObject)

        }
        res.render("view_all_opportunity", {
            title: "There You go! That is all we got for You:",
            arr
        })

    })

})

app.get("/submit_opportunity", function (req, res) {
    res.render("submit_opportunity", {
        title: "Go ahead and submit your opportunity"
    })
})
app.post("/submit_opportunity", function (req, res) {
    var object = {
        orgname: req.body.orgname,
        date: req.body.date,
        numvol: req.body.numvol,
        address: req.body.address,
        city: req.body.city,
        state: req.body.state,
        zipcode: req.body.zipcode,
        description: req.body.description,
        user_id: req.user.user_id,
    }
    console.log(object);
    var query = "INSERT INTO opportunities (orgname, date, numvol, address, city, state, zipcode, description, user_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)"
    connection.query(query, [object.orgname, object.date, object.numvol, object.city, object.address, object.state, object.zipcode, object.description, object.user_id], function (error, result) {
        if (error) throw error
        console.log(result);
        res.render("submit_opportunity", {
            title: "Your request sent successfully"
        })
    })
})

app.get("/singin", function (req, res) {
    res.render("singin", {
        title: "Sing in"
    })
})
app.post("/singin", passport.authenticate("local", {
    successRedirect: "/profile",
    failureRedirect: "/singin"
}));
app.get("/logout", function (req, res) {
    req.logout();
    req.session.destroy();
    res.redirect("/")
})
app.get("/registration", function (req, res) {
    res.render("complete", {
        title: "Registration completed"
    })
})

// app.get("/api/user", function(req, res){
//     return res.json(org)
// })

app.post("/signupOpportunity", function (req, res) {
    var matchObject = {
        user_id: req.body.userID,
        opp_id: req.body.idOpportunity
    }
    console.log(matchObject);
    var query = "INSERT INTO matching (user_id, opp_id) VALUES (?, ?)"
    connection.query(query, [matchObject.user_id, matchObject.opp_id], function (error, result) {
        if (error) throw error
        console.log(result);
        res.render("profile", {
            title: "Your request sent successfully"
        })
    })


})

app.post("/registration", function (req, res) {
    req.checkBody('username', 'Username field cannot be empty.').notEmpty();
    req.checkBody('username', 'Username must be between 4-15 characters long.').len(2, 15);
    req.checkBody('email', 'The email you entered is invalid, please try again.').isEmail();
    req.checkBody('email', 'Email address must be between 4-100 characters long, please try again.').len(4, 100);
    req.checkBody('password', 'Password must be between 6-100 characters long.').len(6, 100);
    req.checkBody("password", "Password must include one lowercase character, one uppercase character, a number, and a special character.").matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.* )(?=.*[^a-zA-Z0-9]).{8,}$/, "i");
    req.checkBody('passwordMatch', 'Password must be between 6-100 characters long.').len(6, 100);
    req.checkBody('passwordMatch', 'Passwords do not match, please try again.').equals(req.body.password);
    req.checkBody('username', 'Username can only contain letters, numbers, or underscores.').matches(/^[A-Za-z0-9_-]+$/, 'i');
    var errors = req.validationErrors();
    if (errors) {
        console.log(`errors: ${JSON.stringify(errors)}`);
        res.render("index", {
            title: "Registration Error",
            errors: errors
        });
    } else {
        // res.json(req.body)
        // console.log(req.body)
        // org.push(req.body)
        console.log(req.body.username)
        console.log(req.body.email)
        console.log(req.body.password)
        connection.query("INSERT INTO users (username, email, password) VALUES (?, ?, ?)", [req.body.username, req.body.email, req.body.password], function (error, result) {
            if (error) throw error
            var query = "SELECT LAST_INSERT_ID() as user_id"
            connection.query(query, function (error, result) {
                if (error) throw error;
                const user_id = result[0];
                console.log(user_id);
                req.login(user_id, function (err) {
                    res.redirect("/");
                })
                // res.render("complete", { title: "Registration completed"})        
            })

        })
    }
});

passport.serializeUser(function (id, done) {
    done(null, id);
});

passport.deserializeUser(function (id, done) {
    done(null, id);
});

function authenticationMiddleware() {
    return (req, res, next) => {
        console.log(`req.session.passport.user: ${JSON.stringify(req.session.passport)}`);

        if (req.isAuthenticated()) return next();
        res.redirect('/singin')
    }
}

app.listen(PORT, function () {
    console.log("App listening on PORT: " + PORT);
});
