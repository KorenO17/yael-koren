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
            { username: "a", id: 1, files: [] },
        ]
}

app.get('/:id/drive', (req, res) => {
    const user = fakeDB.users.find(user => user.id === Number(req.params.id))
    console.log("hi")
    res.json(user.files)
})

app.post('/:id/drive', (req, res) => {

    if (req.body.folderName) {
        const user = fakeDB.users.find(user => user.id === Number(req.params.id))
        user.files.push({ name: req.body.folderName, files: [] })
        if (!fs.existsSync(`./userexamp/${req.body.folderName}`)) {
            fs.mkdirSync(`./userexamp/${req.body.folderName}`, { recursive: true });
        }
        res.redirect('http://localhost:3000/1/drive')
        res.json(user.files)
    }
    else if (req.body.fileName) {
        const user = fakeDB.users.find(user => user.id === Number(req.params.id))
        user.files.push({ name: req.body.fileName })
        console.log(req.body.fileName);
        console.log(req.body.fileContent);
        fs.appendFile(`./userexamp/${req.body.fileName}`,req.body.fileContent, function (err) {
            if (err) throw err;
            console.log('Saved!');
          });
        res.redirect('http://localhost:3000/1/drive')
        res.json(user.files)
    }
  
})
// app.use('/', indexRouter);
// app.use('/users', usersRouter);

module.exports = app;
