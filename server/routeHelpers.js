var db = require('../db/helpers');

module.exports = {
  getAnswers: (req, res, next) => {
    if (req.params.id) {
      db.answer.getAnswerByQuestion(req.params.id).then(result => {
        res.send(result.rows);
      }).catch(err => {
        res.status(500).send(err);
      })
    } else {
      res.status(400).send('question ID not provided');
    }
  },

  getCorrectAnswer: (req, res, next) => {
    var qid = req.params.questionID;
    if (qid) {
      db.answer.getCorrectAnswer(qid).then(result => {
        res.send(result.rows);
      }).catch(err => {
        res.status(500).send(err);
      })
    } else {
      res.status(400).send('question ID not provided')
    }
  },

  postAnswers: (req, res, next) => {
    var qid = req.body.qid;
    var answers = req.body.answers;
    if (qid && answers) {
      var answerString = '';
      for (var i = 0; i < answers.length; i++) {
        answerString += ('(' + qid + ',"' + answers[i].answer + '",' + (answers[i].correct ? 1 : 0) + "),");
      }
      answerString = answerString.substring(0, answerString - 2);
      db.answer.postMultiple(answerString).then(result => {
        res.end();
      }).catch(err => {
        res.status(500).send(err);
      })

    } else {
      res.status(400).send('question ID/answers not provided');
    }
  },

  login: (req, res, next) => {
    var login = req.body;
    // console.log(req.body);
    if (login) {
      db.user.getByAuth(login.user_id).then(result => {
        if (result.rows.length > 0) {
          res.send(result.rows[0]);
        } else {
          db.user.post(1, login.given_name, login.family_name, login.email ? login.email : '', '', login.user_id).then(post => {
            db.user.getByAuth(login.user_id).then(result2 => {
              res.send(result2.rows[0]);
            })
          })
        }
      }).catch(err => {
        console.log(err);
        res.status(400).send('login doesn"t exist');
      })
    } else {
      res.status(400).send('login information not provided');
    }
  },

  getQuestions: (req, res, next) => {
    var socket = req.params.socket;
    if (socket) {
      db.question.getQuestionsBySocket(socket).then(result => {
        if (result.rows.length > 0) {
          res.send(result.rows);
        } else {
          res.status(400).send('no questions found with given socket', socket);
        }
      }).catch(err => {
        res.status(500).send(err)
      })
    } else {
      res.status(400).send('socket not provided');
    }
  },

  postQuestion: (req, res, next) => {
    var pid = req.body.presentationID;
    var type = req.body.type;
    var question = req.body.question;
    if (pid && type && question) {
      db.question.post(pid, type, question).then(result => {
        console.log('question posted');
        res.end();
      }).catch(err => {
        res.status(500).send(err);
      })
    } else {
      res.status(400).send('presentationID or type or question was not provided');
    }
  },

  getPresentationByS: (req, res, next) => {
    var socket = req.params.socket;
    if (socket) {
      db.presentation.getPresBySocket(socket).then(result => {
        if (result.rows.length > 0) {
          res.send(result.rows[0]);
        } else {
          res.status(400).send('no presentation found with given socket', socket);
        }
      }).catch(err => {
        res.status(500).send(err);
      })
    } else {
      res.status(400).send('socket not provided');
    }
  },

  getPresentationByU: (req, res, next) => {
    var userID = req.params.userID;
    if (userID) {
      db.presentation.getPresByUser(user).then(result => {
        if (result.rows.length > 0) {
          res.send(result.rows);
        } else {
          res.status(400).send('no presentation found for given user');
        }
      }).catch(err => {
        res.status(500).send(err);
      })
    } else {
      res.status(400).send('userID not provided');
    }
  },

  postPresentation: (req, res, next) => {
    var user_id = req.body.user_id;
    if (user_id) {
      db.presentation.post(user_id).then(result => {
        db.presentation.getLastID(user_id).then(result2 => {
          res.send(result2.rows[0].presentationID);
        }).catch(err) => {
          res.status(500).send(err);
        }
      }).catch(err => {
        res.status(500).send(err);
      })
    } else {
      res.status(400).send('user ID not provided');
    }
  },

  postSession: (req, res, next) => {
    var pid = req.body.presentationID;
    var socket = req.body.socket;
    if (pid && socket) {
      db.session.post(pid, socket).then(result => {
        db.session.getSessionBySocket(socket).then(result2 => {
          if (result2.rows.length > 0) {
            res.send(result2.rows[0].sessionID);
          }
        }).catch(err => {
          res.status(500).send(err);
        })
      }).catch(err => {
        res.status(500).send(err);
      })
    } else {
      res.status(400).send('pid or socket not provided');
    }
  },

}

