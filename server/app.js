var express = require('express');
var path = require('path');
var cors = require('cors');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var fs = require('fs');

// var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/users');

var app = express();

app.use(cors())
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

let fakeDB = {
    users:
        [
            { username: "a", password: "a", id: 1, files: ["a", "b", "c", "d", "e", "f", "g", "h", "i"] },
            { username: "b", password: "b", id: 2, files: ["j", "k", "l"] }
        ]
}

//login:
app.post('/:username', (req, res) => {
    const user = fakeDB.users.find(user => (user.password === req.body.password && user.username === req.body.username))
    console.log(user)
    res.json(user ? user : [])
})

//drive:
app.get('/:username/drive', (req, res) => {
    const user = fakeDB.users.find(user => user.username === req.params.username)
    console.log(user.files)
    res.json(user.files)
})

//register:
app.post('/register/:username', (req, res) => {
    const user = fakeDB.users.find(user => user.username === req.body.username)
    console.log(user)
    if (!user) {
        fakeDB.users.push({ username: req.body.username, password: req.body.password, id: fakeDB.users.length + 1, files: [] })
        console.log(fakeDB.users)
        fs.mkdir(`./users/${req.body.username}`, (err) => { if (err) throw err; });
    }
    res.json(user ? "This username is already in use" : null)
})

// app.use('/', indexRouter);
// app.use('/users', usersRouter);

module.exports = app;
