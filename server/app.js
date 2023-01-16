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
            resolve(fakeDB)
        });
    });
}

function editUsersData(data) {
    fs.writeFile(path.join(__dirname, './users.json'), JSON.stringify(data), (err) => err && console.error(err));
}

//login:
app.post('/:username', async (req, res) => {
    let fakeDB = await getUsersData();
    const user = fakeDB.find(user => (user.password === req.body.password && user.username === req.body.username))
    res.json(user ? user : [])
})

//register:
app.post('/register/:username', async (req, res) => {
    let fakeDB = await getUsersData();
    const user = fakeDB.find(user => user.username === req.body.username)
    if (!user) {
        fakeDB.push({ username: req.body.username, password: req.body.password, id: fakeDB.length + 1, files: [] })
        editUsersData(fakeDB)
        fs.mkdir(`./users/${req.body.username}`, (err) => { if (err) throw err; });
    }
    res.json(user ? "This username is already in use" : req.body.username)
})

//drive:
app.get('/:username/drive', async (req, res) => {
    let fakeDB = await getUsersData();
    let user = fakeDB.find(user => user.username === req.params.username)
    let files=user.files
    let folder={}
    console.log(req.query.path.split('/'));
    if (req.query.path === "") res.json(user.files)
    else {
        let pathArr = req.query.path.split('/')
        console.log("path: " + req.query.path);
        for (let i=1;i<pathArr.length;i++){
           folder=files.find(folder => folder.name === pathArr[i])
           if(!folder) break
            files=folder.files
        }
        res.json(files)
    }
})


app.post('/:username/drive', async (req, res) => {
    let fakeDB = await getUsersData();
    let user = fakeDB.find(user => user.username === req.body.username)
    if (req.body.folderName) {
        if (!fs.existsSync(`./users/${req.body.username}/${req.body.folderName}`)) {
            user.files.push({ name: req.body.folderName, files: [], type: 'folder' });

            editUsersData(fakeDB)
            fs.mkdirSync(`./users/${req.body.username}/${req.body.folderName}`, { recursive: true });
        }
        res.json(user.files)
    }
    else if (req.body.fileName) {
        user.files.push({ name: { nameFlag: false, name: req.body.fileName }, content: { contentFlag: false, content: req.body.fileContent }, type: 'file', info: { infoFlag: false, createTime: new Date().toLocaleTimeString('he-IL', { timeZone: 'Asia/Jerusalem' }) } });
        editUsersData(fakeDB)
        fs.appendFile(`./users/${req.body.username}/${req.body.fileName}`, req.body.fileContent, function (err) {
            if (err) throw err;
        });

        res.json(user.files)
    }
})
app.post('/:username/renameFile', async (req, res) => {
    let fakeDB = await getUsersData();
    let user = fakeDB.find(user => user.username === req.body.username)
    let tempUserFile = user.files.find(file => file.name.name === req.body.fileName);
    tempUserFile.name.name = req.body.newFileName;
    editUsersData(fakeDB)

    fs.rename(`./users/${req.body.username}/${req.body.fileName}`, `./users/${req.body.username}/${req.body.newFileName}`, (err) => { if (err) throw err; })
})

app.post('/:username/deleteFile', async (req, res) => {
    let fakeDB = await getUsersData();
    let user = fakeDB.find(user => user.username === req.body.username)
    user.files.splice(req.body.index,1)
    editUsersData(fakeDB)
    fs.unlink(`./users/${req.body.username}/${req.body.fileName}`, (err) => { if (err) throw err; })
})
// app.use('/', indexRouter);
// app.use('/users', usersRouter);

module.exports = app;
