var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var cors = require('cors');
var helpers = require('./routeHelpers');

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.options('*', cors());


app.get('/', (req, res) => {res.send('Hello world')});

//LOGIN
app.post('/login', helpers.login);

// ANSWERS
app.get('/aByQ/:id', helpers.getAnswers);
app.get('/aByCorrect', helpers.getCorrectAnswer);
app.post('/aByQ', helpers.postAnswers);

// QUESTIONS
app.get('/qBySocket', helpers.getQuestions);
app.post('/qByP', helpers.postQuestion);

// PRESENTATION
app.get('/pBySocket', helpers.getPresentation);
app.post('/pByU', helpers.postPresentation);

// SESSION
// app.get('/getS/:id', helpers.getSession);
app.post('/sByPS', helpers.postSession);


module.exports = app;