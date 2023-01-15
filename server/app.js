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
        //   {username: "a", password:"a", files:[]}
        ]
}

let currUser = ""

//login:
app.post('/:username', (req, res) => {
    const user = fakeDB.users.find(user => (user.password === req.body.password && user.username === req.body.username))
    console.log(user)
    currUser = req.body.username
    res.json(user ? user : [])
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
    currUser = req.body.username
    res.json(user ? "This username is already in use" : null)
})

//drive:
app.get('/:username/drive', (req, res) => {
    const user = fakeDB.users.find(user => user.username === req.params.username)
    console.log(user.files)
    res.json(user.files)
})

app.get('/shlimziGibut',(req, res) => {
    res.json(currUser)
})

app.post('/:username/drive', (req, res) => {
    if (req.body.folderName) {
        const user = fakeDB.users.find(user => user.username === req.params.username)
        console.log(user);
        user.files.push({ name: req.body.folderName, files: [] })
        if (!fs.existsSync(`./users/${currUser}/${req.body.folderName}`)) {
            fs.mkdirSync(`./users/${currUser}/${req.body.folderName}`, { recursive: true });
        }
        res.redirect(`http://localhost:3000/${req.params.username}/drive`)
        res.json(user.files)
    }
    else if (req.body.fileName) {
        const user = fakeDB.users.find(user => user.username === req.params.username)
        user.files.push({ name: req.body.fileName })
        console.log(req.body.fileName);
        console.log(req.body.fileContent);
        fs.appendFile(`./users/${currUser}/${req.body.fileName}`, req.body.fileContent, function (err) {
            if (err) throw err;
            console.log('Saved!');
        });
        res.redirect(`http://localhost:3000/${req.params.username}/drive`)
        res.json(user.files)
    }

})
// app.use('/', indexRouter);
// app.use('/users', usersRouter);

module.exports = app;
