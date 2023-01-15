var express = require('express');
var path = require('path');
var cors = require('cors');
var cookieParser = require('cookie-parser');
var logger = require('morgan');


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
            { username: "a", id: 1, files: ["a", "b", "c", "d", "e", "f", "g", "h", "i"] },
            { username: "b", id: 2, files: ["j", "k", "l"] }
        ]
}

app.get('/:id', (req, res)=> {
    const user = fakeDB.users.find(user => user.id === Number(req.params.id))
    res.json(user.files)
})


// app.use('/', indexRouter);
// app.use('/users', usersRouter);

module.exports = app;
