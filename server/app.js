var express = require('express');
var path = require('path');
var cors = require('cors');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var fs = require('fs');
const { json } = require('express');

// var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/users');

var app = express();

app.use(cors())
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

function getUsersData() {
    return new Promise((resolve, reject) => {
        fs.readFile(path.join(__dirname, './users.json'), 'utf8', (err, data) => {
            if (!data) return resolve([]);
            let fakeDB = JSON.parse(data)
            console.log("fake Db 1: ", fakeDB);
            resolve(fakeDB)
        });
    });
}

function editUsersData(data) {
    fs.writeFile(path.join(__dirname, './users.json'), JSON.stringify(data), (err) => err && console.error(err));
}

let currUser = ""

//login:
app.post('/:username', async (req, res) => {
    let fakeDB = await getUsersData();
    console.log("fake Db 2: ", fakeDB);
    const user = fakeDB.find(user => (user.password === req.body.password && user.username === req.body.username))
    currUser = req.body.username
    res.json(user ? user : [])
})

//register:
app.post('/register/:username', async (req, res) => {
    let fakeDB = await getUsersData();
    const user = fakeDB.find(user => user.username === req.body.username)
    console.log(user)
    if (!user) {
        fakeDB.push({ username: req.body.username, password: req.body.password, id: fakeDB.length + 1, files: [] })
        console.log("fake Db 3: ", fakeDB);
        editUsersData(fakeDB)
        fs.mkdir(`./users/${req.body.username}`, (err) => { if (err) throw err; });
    }
    currUser = req.body.username
    res.json(user ? "This username is already in use" : req.body.username)
})

//drive:
app.get('/:username/drive', async (req, res) => {
    let fakeDB = await getUsersData();
    const user = fakeDB.find(user => user.username === req.params.username)
    console.log(user.files)
    res.json(user.files)
})

app.get('/shlimziGibut', (req, res) => {
    res.json(currUser)
})

app.post('/:username/drive', async (req, res) => {
    let fakeDB = await getUsersData();
    console.log("fakeDB: ", fakeDB)
    let user = fakeDB.find(user => user.username === req.body.username)
    if (req.body.folderName) {
        console.log("user1: ",user);
        if (!fs.existsSync(`./users/${currUser}/${req.body.folderName}`)) {
            console.log("user: ",user);
            fakeDB.find(user => user.username === req.body.username).files.push({ name: req.body.folderName, files: [] })
            user.files.push({ name: req.body.folderName, files: [] })
            console.log("fakeDB: ", fakeDB)
            editUsersData(fakeDB)
            fs.mkdirSync(`./users/${currUser}/${req.body.folderName}`, { recursive: true });
            console.log(user.files);
        }
        res.json(user.files)
    }
    else if (req.body.fileName) {
        fakeDB.find(user => user.username === req.body.username).files.push({ name: req.body.fileName })
        console.log(req.body.fileName);
        console.log(req.body.fileContent);
        editUsersData(fakeDB)
        fs.appendFile(`./users/${currUser}/${req.body.fileName}`, req.body.fileContent, function (err) {
            if (err) throw err;
            console.log('Saved!');
        });
        res.json(user.files)
    }

})
// app.use('/', indexRouter);
// app.use('/users', usersRouter);

module.exports = app;
