var pg = require('pg');
var db = require('../db/helpers');
var Promise = require('bluebird');
var data = require('./fakeData');

var cli = new pg.Client('postgres://ephqygbj:sTgEHTHK82B7Rc9WVZ92y8PEcAKkm8zh@babar.elephantsql.com:5432/ephqygbj');

// "Saivickna";"Raveendran";"";"";"facebook|10101962619442927"
// "Saivickna";"Raveendran";"saivickna.r@gmail.com";"";"google-oauth2|107680791295256315609"

// CREATE USER

db.user.post(0, "Saivickna", "Raveendran", "", "", "facebook|10101962619442927").then(UPresult=> {
  console.log('successfully posted user');
  // CREATE PRESENTATION
  var uID = UPresult.rows[0].userID;
  db.presentation.post(uID).then(PPresult => {
    console.log('successfully posted presentation');
      // CREATE QUESTIONS
      var pID = PPresult.rows[0].presentationID;
      //  POST QUESTION 1
      for (var i = 0; i < 4; i++) {

        db.question.post(pID, "1", data.questions[i]).then(QPresult => {
            // ADD ANSWERS FOR QUESTION
            var qID = QPresult.rows[0].questionID;
            var answers = data.aString[i](qID);
            // console.log(answers);
            db.answer.postMultiple(answers).then(Aresult => {
              console.log('posted answers for question');
            })
            .catch(err => {
              console.log(err + ' failed to post answers to question');
            })
          }).catch(err => {
          console.log(err + ' failed to post question')
        })
        console.log('successfully posted question ' + (i + 1))
      }

      //POST SESSION
      db.session.post(pID, "Tsocket").then(Sresult => {
        console.log('successfully posted session');
      }).catch(err => {
        console.log(err + ' failed to post session');
      })


  }).catch(err => {
    console.log(err + ' failed to post presentation')
  })
}).catch(err => {
  console.log('failed to post user');
})


  // var answers = data.aString[0](21);
  // console.log(answers);
  // db.answer.postMultiple('(21, \'A\', 0)').then(Aresult => {
  //   console.log('posted answers for question');
  // })
  // .catch(err => {
  //   console.log(err + ' failed to post answers to question');
  // })