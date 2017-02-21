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
app.post('/login', helpers.login); // good

// ANSWERS
app.get('/allA', helpers.getAllAnswers); // good
app.get('/aByQ/:id', helpers.getAnswers); // good
app.get('/aByCorrect/:qid', helpers.getCorrectAnswer);// good
app.post('/aByQ', helpers.postAnswer); // good+
app.post('/aByQs', helpers.postAnswers); // good

// QUESTIONS
app.get('/allQ', helpers.getAllQuestions);
app.get('/qBySocket/:socket', helpers.getQuestions); // good
app.get('/qByP/:pid', helpers.getQuestionsByP) // good
app.post('/qByP', helpers.postQuestion); // good+

// PRESENTATION
app.get('/pBySocket/:socket', helpers.getPresentationByS); //good
app.get('/pByU/:id', helpers.getPresentationByU) // good
app.post('/postPByU', helpers.postPresentation); // good+

// SESSION
app.get('/sByS/:socket', helpers.getSession); // good
app.get('/sAll', helpers.getAllSessions); // good
app.post('/sByPS', helpers.postSession); // good+

// RESPONSE
app.get('/rByQ/:qid', helpers.getResponseByQuestion); //good
app.get('/rByS/:sessionID', helpers.getResponseBySession); //good
app.get('/rByQS/:qid/:sessionID', helpers.getResponseByQandS);// good
app.post('/rPost', helpers.postResponse); //good+
app.post('/rPostMultiple', helpers.postMultiResponses); //good

module.exports = app;