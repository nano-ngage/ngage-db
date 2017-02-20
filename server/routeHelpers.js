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

  getAllAnswers: (req, res, next) => {
    db.answer.get().then(result => {
      res.send(result.rows);
    }).catch(err => {
      res.status(500).send(err);
    })
  },

  getCorrectAnswer: (req, res, next) => {
    var qid = req.params.qid;
    if (qid) {
      db.answer.getCorrect(qid).then(result => {
        res.send(result.rows);
      }).catch(err => {
        res.status(500).send(err);
      })
    } else {
      res.status(400).send('question ID not provided')
    }
  },

  postAnswer: (req, res, next) => {
    var qid = req.body.questionID;
    var answer = req.body.answer;
    var correct = req.body.correct;
    if (qid && answer && correct) {
      db.answer.post(qid, answer, correct).then(result => {
        res.end();
      }).catch(err => {
        res.status(500).send(err);
      })
    }
  },

  postAnswers: (req, res, next) => {
    var qid = req.body.questionID;
    var answers = req.body.answers;
    if (qid && answers) {
      var answerString = '';
      for (var i = 0; i < answers.length; i++) {
        answerString += '(' + qid + ', \'' + answers[i].answer + '\', ' + (answers[i].correct ? 1 : 0) + "), ";
      }
      answerString = answerString.slice(0, answerString.length - 2);
      console.log(answerString);
      db.answer.postMultiple(answerString).then(result => {
        res.end();
      }).catch(err => {
        res.status(500).send(err + answerString);
      })

    } else {
      res.status(400).send('question ID/answers not provided');
    }
  },

  login: (req, res, next) => {
    var login = req.body;
    // console.log(req.body);
    if (login) {
      db.user.getByAuth(login.auth_id).then(result => {
        if (result.rows.length > 0) {
          res.send(result.rows[0]);
        } else {
          db.user.post(1, login.given_name, login.family_name, login.email ? login.email : '', '', login.auth_id).then(post => {
            db.user.getByAuth(login.auth_id).then(result2 => {
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

  getQuestionsByP: (req, res, next) => {
    var pid = req.params.pid;
    if (pid) {
      db.question.getQuestionsByPresentation(pid).then(result => {
        if (result.rows.length > 0) {
          res.send(result.rows);
        } else {
          res.status(400).send('no questions found with given presentationID');
        }
      }).catch(err => {
        res.status(500).send(err);
      })
    } else {
      res.status(400).send('presentation Id not provided');
    }
  },

  postQuestion: (req, res, next) => {
    var pid = req.body.presentationID;
    var type = req.body.type;
    var question = req.body.question;
    console.log(pid);
    if (pid && type && question) {
      db.question.post(pid, type, question).then(result => {
        res.end();
      }).catch(err => {
        res.status(500).send(err);
      })
    } else {
      res.status(400).send('presentationID or type or question was not provided' + pid);
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
    var userID = req.params.id;
    if (userID) {
      db.presentation.getPresByUser(userID).then(result => {
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
        console.log(result);
        res.end();
      }).catch(err => {
        res.status(500).send(err);
      })
    } else {
      res.status(400).send('user ID not provided');
    }
  },

  getSession: (req, res, next) => {
    var socket = req.params.socket;
    if (socket) {
      db.session.getSessionBySocket(socket).then(result => {
        if (result.rows.length > 0) {
          res.send(result.rows);
        } else {
          res.status(400).send('no session found for given id');
        }
      }).catch(err => {
        res.status(500).send(err);
      })
    } else {
      res.status(400).send('sessionID not found');
    }
  },

  postSession: (req, res, next) => {
    var pid = req.body.presentationID;
    var socket = req.body.socket;
    if (pid && socket) {
      db.session.post(pid, socket).then(result => {
        console.log(result);
        res.end();
      }).catch(err => {
        res.status(500).send(err);
      })
    } else {
      res.status(400).send('pid or socket not provided');
    }
  },

}

