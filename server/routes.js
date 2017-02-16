var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var cors = require('cors');

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.options('*', cors());
app.get('/', (req, res) => {res.send('Hello world')});
module.exports = app;