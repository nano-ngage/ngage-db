var pg = require('pg');
var db = require('../db/helpers');
var Promise = require('bluebird');
var data = require('./fakeData');

var cli = new pg.Client('postgres://ephqygbj:sTgEHTHK82B7Rc9WVZ92y8PEcAKkm8zh@babar.elephantsql.com:5432/ephqygbj');

// "Saivickna";"Raveendran";"";"";"facebook|10101962619442927"
// "Saivickna";"Raveendran";"saivickna.r@gmail.com";"";"google-oauth2|107680791295256315609"

// CREATE USER
db.user.post(0, "Saivickna", "Raveendran", "", "", "facebook|10101962619442927").then(UPresult=> {
  // CREATE PRESENTATION
  var uID = UPresult.rows[0].userID;
  db.presentation.post(uID).then(PPresult => {
      // CREATE QUESTIONS
      var pID = PPresult.rows[0].presentationID;
      //  POST QUESTION 1
      (for var i = 0; i < 4; i++) {

        db.question.post(pID, "1", data.questions[i]).then(QPresult => {
            // ADD ANSWERS FOR QUESTION
            var qID = QPresult.rows[0].questionID;
            var answers = data.aString[i](qID);
            db.answer.postMultiple(answers)
            .catch(err => {
              res.status(500).send(err + 'failed ot post answers to q1');
            })
          }).catch(err => {
          res.status(500).send(err + 'failed to post question 1')
        })

      }


  }).catch(err => {
    res.status(500).send(err + 'failed to post presentation')
  })
}).catch(err => {
  res.status(500).send(err + 'failed to post user');
})