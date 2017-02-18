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
app.get('/aByQ/:id', helpers.getAnswers);


app.post('/aByQ', helpers.postAnswers);
app.post('/login', helpers.login);

module.exports = app;