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

// USERS
app.get('/allU', helpers.getAllUsers);
app.get('/searchU/:search', helpers.searchUsers);

//LOGIN
app.post('/login', helpers.login); // good

// ANSWERS
app.get('/aAll', helpers.getAllAnswers); // good
app.get('/a/:id', helpers.getAnswer); // good
app.get('/aByQ/:id', helpers.getAnswers); // good
app.get('/aByCorrect/:qid', helpers.getCorrectAnswer);// good
app.post('/aByQ', helpers.postAnswer); // good+
app.post('/aByQs', helpers.postAnswers); // good
app.put('/a/:aid', helpers.updateAnswer); // good
app.delete('/a/:aid', helpers.deleteAnswer); // good

// QUESTIONS
app.get('/qAll', helpers.getAllQuestions); // good
app.get('/q/:id', helpers.getQuestion) // good
app.get('/qByS/:socket', helpers.getQuestions); // good
app.get('/qByP/:pid', helpers.getQuestionsByP) // good
app.post('/qByP', helpers.postQuestion); // good+
app.put('/q/:qid', helpers.updateQuestion); // good+
app.delete('/q/:qid', helpers.deleteQuestion); // good+

// PRESENTATION
app.get('/p/:id', helpers.getPresentation); //good
app.get('/pByS/:socket', helpers.getPresentationByS); //good
app.get('/pByU/:id', helpers.getPresentationByU); // good
app.get('/pByULatest/:id/', helpers.getLatestPresentationByUser); // good
app.post('/pByU', helpers.postPresentation); // good+
app.put('/p/:pid', helpers.updatePresentation); // good
app.delete('/p/:pid', helpers.deletePresentation); // good

// SESSION
app.get('/sByS/:socket', helpers.getSession); // good
app.get('/sAll', helpers.getAllSessions); // good
app.post('/sByPS', helpers.postSession); // good+

// RESPONSE
app.get('/rByQ/:qid', helpers.getResponseByQuestion); //good
app.get('/rByS/:sessionID', helpers.getResponseBySession); //good
app.get('/rByQS/:qid/:sessionID', helpers.getResponseByQandS);// good
app.post('/r', helpers.postResponse); //good+
app.post('/rMultiple', helpers.postMultiResponses); //good

// AUDQUESTION
app.get('/aq/:id', helpers.getAudQuestion);
app.get('/aqByS/:sessionID', helpers.getAudQuestionBySession);
app.post('/aqByS', helpers.postAudQuestion);
app.put('/aq/:id', helpers.updateAudQuestion);


//PARTICIPANT
app.post('/pa', helpers.postParticipant);

//GROUP
app.post('/g', helpers.postGroup);
app.put('/g/:groupID', helpers.updateGroup);
app.get('/gByU/:userID', helpers.getGroupByUser);
app.delete('/g/:groupID', helpers.deleteGroup);

//GROUP MEMBER
app.post('/gm', helpers.postGroupMember);
app.get('/gmByG/:groupID', helpers.getGroupMemberByGroup);
app.delete('/gm/:groupID/:userID', helpers.deleteGroupMember);



module.exports = app;
