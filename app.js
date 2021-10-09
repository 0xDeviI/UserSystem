const express = require('express');
const bodyParser = require('body-parser');
const validator = require('validator');
const app = new express();
const mongoose = require('mongoose');
const session = require('express-session');
var randomstring = require("randomstring");
mongoose.connect('mongodb://localhost:27017/UserSystem', { useNewUrlParser: true, useUnifiedTopology: true });

app.use(session({ secret: randomstring.generate(32), cookie: { maxAge: 60000 * 5 }, resave: false, saveUninitialized: true }));

const user = new mongoose.Schema({
    name: String,
    username: String,
    email: String,
    password: String
});

const User = mongoose.model('User', user);

app.use(express.static(__dirname + '/views'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

app.post("/signin", (req, response) => {
    if (req.body != null && req.body != undefined) {
        let _username = req.body.username;
        let _password = req.body.password;
        User.find({ username: _username, password: _password }, (err, res) => {
            if (err) {
                response.send(JSON.stringify({ "error": true, "message": "خطايي رخ داد. بعدا تلاش كنيد!" }));
            } else {
                if (res.length == 1) {
                    req.session.isLoggedIn = true;
                    req.session.loggedInUsername = _username;
                    response.send(JSON.stringify({ "error": false, "user": JSON.stringify(res[0]) }));
                } else {
                    response.send(JSON.stringify({ "error": true, "message": "نام كاربري يا كلمه عبور نادرست است." }));
                }
            }
        });
    } else {
        response.send(JSON.stringify({ "error": true, "message": "نام كاربري يا كلمه عبور نادرست است." }));
    }
});

app.post("/signup", (req, response) => {
    if (req.body != null && req.body != undefined) {
        var name = req.body.name;
        var username = req.body.username;
        var email = req.body.email;
        var password = req.body.password;
        User.find({ username: username }, (err, res) => {
            if (err)
                response.send(JSON.stringify({ "error": true, "message": "خطايي رخ داد. بعدا تلاش كنيد!" }));
            if (res.length == 0) {
                var newUsre = new User({ name: name, username: username, email: email, password: password });
                newUsre.save((err, res) => {
                    if (err)
                        response.send(JSON.stringify({ "error": true, "message": "خطايي رخ داد. بعدا تلاش كنيد!" }));
                    else {
                        response.send(JSON.stringify({ "error": false, "message": "حساب كاربري شما ساخته شد!" }));
                    }
                });
            } else {
                response.send(JSON.stringify({ "error": true, "message": "نام كاربري انتخاب شده توسط شخص ديگري انتخاب شده است." }));
            }
        })
    } else
        response.send(JSON.stringify({ "error": true, "message": "خطايي رخ داد. بعدا تلاش كنيد!" }));
});

app.post("/passrecover", (req, response) => {
    if (req.body != null && req.body != undefined) {
        let _username = req.body.username;
        let _email = req.body.email;
        let _password = req.body.password;
        User.find({ username: _username, email: _email }, (err, res) => {
            if (err) {
                response.send(JSON.stringify({ "error": true, "message": "خطايي رخ داد. بعدا تلاش كنيد!" }));
            } else {
                if (res.length == 1) {
                    User.updateOne({ username: _username, email: _email }, { $set: { "password": _password } }, { new: false, upsert: true }, function(err, _res) {
                        if (err) {
                            response.send(JSON.stringify({ "error": true, "message": "خطايي رخ داد. بعدا تلاش كنيد!" }));
                        } else {
                            response.send(JSON.stringify({ "error": false, "message": "كلمه عبور ويرايش شد!" }));
                        }
                    });
                } else {
                    response.send(JSON.stringify({ "error": true, "message": "كاربر پيدا نشد" }));
                }
            }
        });
    } else {
        response.send(JSON.stringify({ "error": true, "message": "نام كاربري يا كلمه عبور نادرست است." }));
    }
});

app.listen(3000, () => {
    console.log("Application started and Listening on port 3000");
});