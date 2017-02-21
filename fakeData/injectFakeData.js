var pg = require('pg');
var db = require('../db/helpers');
var Promise = require('bluebird');
var data = require('./fakeData');

var cli = new pg.Client('postgres://ephqygbj:sTgEHTHK82B7Rc9WVZ92y8PEcAKkm8zh@babar.elephantsql.com:5432/ephqygbj');

// CREATE USER PRESENTER
db.user.post(0, "Saivickna", "Raveendran", "", "", "facebook|10101962619442927").then(UPresult=> {
  console.log('successfully posted user');
  // CREATE PRESENTATION
  var uID = UPresult.rows[0].userID;
  db.presentation.post(uID).then(PPresult => {
    console.log('successfully posted presentation');
      // CREATE QUESTIONS
      var pID = PPresult.rows[0].presentationID;
      //  POST QUESTION 1
        db.question.post(pID, "1", data.questions[0]).then(QPresult => {
            console.log('successfully posted question ' + 1)
            // ADD ANSWERS FOR QUESTION
            var qID = QPresult.rows[0].questionID;
            var answers = data.aString[0](qID);
            // console.log(answers);
            db.answer.postMultiple(answers).then(Aresult => {
              console.log('posted answers for question');
              // QUESTION 2
              db.question.post(pID, "1", data.questions[1]).then(QPresult => {
                  console.log('successfully posted question ' + 2)
                  // ADD ANSWERS FOR QUESTION 2
                  var qID = QPresult.rows[0].questionID;
                  var answers = data.aString[1](qID);
                  // console.log(answers);
                  db.answer.postMultiple(answers).then(Aresult => {
                    console.log('posted answers for question 2');
                    // QUESTION 3
                    db.question.post(pID, "1", data.questions[2]).then(QPresult => {
                        console.log('successfully posted question ' + 3)
                        // ADD ANSWERS FOR QUESTION 3
                        var qID = QPresult.rows[0].questionID;
                        var answers = data.aString[2](qID);
                        // console.log(answers);
                        db.answer.postMultiple(answers).then(Aresult => {
                          console.log('posted answers for question 3');
                          // QUESTION 4
                          db.question.post(pID, "1", data.questions[3]).then(QPresult => {
                                console.log('successfully posted question ' + 4)
                                // ADD ANSWERS FOR QUESTION 4
                                var qID = QPresult.rows[0].questionID;
                                var answers = data.aString[3](qID);
                                // console.log(answers);
                                db.answer.postMultiple(answers).then(Aresult => {
                                  console.log('posted answers for question 4');
                                })
                                .catch(err => {
                                  console.log(err + ' failed to post answers to question 4');
                                })
                              }).catch(err => {
                              console.log(err + ' failed to post question')
                            })
                        })
                        .catch(err => {
                          console.log(err + ' failed to post answers to question');
                        })
                      }).catch(err => {
                      console.log(err + ' failed to post question')
                    })
                  })
                  .catch(err => {
                    console.log(err + ' failed to post answers to question');
                  })
                }).catch(err => {
                console.log(err + ' failed to post question')
              })
            })

            .catch(err => {
              console.log(err + ' failed to post answers to question');
            })
          }).catch(err => {
          console.log(err + ' failed to post question')
        })

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
