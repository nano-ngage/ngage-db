var db = require('../db/helpers');

module.exports = {
  getAllUsers: (req, res, next) => {
    db.user.getAll().then(result => {
      res.send(result.rows);
    }).catch(err => {
      res.status(500).send(err);
    })
  },

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
    db.answer.getAll().then(result => {
      console.log(result.rows)
      res.send(result.rows);
    }).catch(err => {
      res.status(500).send(err + ' error with getting all ans');
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
        var answerID = result.rows[0].answerID;
        if (answerID) {
          db.answer.get(answerID).then(result2 => {
          if (result2.rows.length > 0) {
            res.send(result2.rows[0]);
          } else {
            res.send('No answer found for given ID')
          }
        }).catch(err => {
          res.status(500).send(err);
        })
        } else {
          res.send('answerID not returned')
        }
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
      db.answer.postMultiple(answerString).then(result => {
        res.send(result.rows);
      }).catch(err => {
        res.status(500).send(err + answerString);
      })

    } else {
      res.status(400).send('question ID/answers not provided');
    }
  },

  updateAnswer: (req, res, next) => {
    var qid = req.body.questionID;
    var answer = req.body.answer;
    var correct = req.body.correct;
    var aid = req.params.aid;
    if (qid && answer && correct && aid) {
        db.answer.update(qid, answer, correct, aid).then(result => {
          db.answer.get(aid).then(result2 => {
            if (result2.rows.length > 0) {
              res.send(result2.rows[0]);
            } else {
              res.status(400).send('No answer for given aID');
            }
          })
        }).catch(err => {
          res.status(500).send(err);
        })
    } else {
      res.status(400).send('QID, answer, correct, or answerID not provided');
    }
  },

  deleteAnswer: (req, res, next) => {
    var aid = req.params.aid;
    if (aid) {
    var string = '(' + aid + ')';
      db.answer.delete(string).then(result => {
        console.log('answer ' + aid + ' deleted')
        res.end();
      });
    } else {
      res.status(400).send('answerID not provided');
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

  getAllQuestions: (req, res, next) => {
    db.question.getAll().then(result => {
      if (result.rows.length > 0) {
        res.send(result.rows);
      } else {
        res.status(400).send('no questions found in database');
      }
    }).catch(err => {
      res.status(500).send(err);
    })
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
    if (pid && type && question) {
      db.question.post(pid, type, question).then(result => {
        var qid = result.rows[0].questionID;
        if (qid) {
          db.question.get(qid).then(result2 => {
          if (result2.rows.length > 0) {
            res.send(result2.rows[0]);
          } else {
            res.send('No question found with given qID');
          }
          }).catch(err => {
            res.status(500).send(err);
          })
        } else {
          res.send('No questionID returned');
        }
      }).catch(err => {
        res.status(500).send(err);
      })
    } else {
      res.status(400).send('presentationID or type or question was not provided' + pid);
    }
  },

  updateQuestion: (req, res, next) => {
    var qid = req.params.qid;
    var type = req.body.type;
    var question = req.body.question;
    if (qid && type && question) {
      db.question.put(type, question, qid).then(result => {
        db.question.get(qid).then(result2 => {
          if (result2.rows.length > 0) {
            res.send(result2.rows[0]);
          } else {
            res.status(400).send('No question found for given ID');
          }
        }).catch(err => {
          res.status(500).send(err + 'error getting question');
        })
      }).catch(err => {
        res.status(500).send(err + 'error updating question');
      })
    } else {
      res.status(400).send('question ID not provided');
    }
  },

  deleteQuestion: (req, res, next) => {
    var qid = req.params.qid;
    if (qid) {
      db.question.get(qid).then(result => {
        if (result.rows.length > 0) {
          db.question.delete(qid).then(result2 => {
            res.send('question ' + qid + ' deleted');
          }).catch(err => {
            res.status(500).send(err);
          })
        } else {
          res.status(400).send('No question found with given ID');
        }
      }).catch(err => {
        res.status(500).send(err);
      })
    } else {
      res.status(400).send('question ID not provided')
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

  getLatestPresentationByUser: (req, res, next) => {
    var userID = req.params.id;
    if (userID) {
      db.presentation.getLastID(userID).then(result => {
        if (result.rows.length > 0) {
          res.send(result.rows[0]);
        } else {
          res.status(400).send('No presentation found with given userID');
        }
      })
    } else {
      res.send(400).send('UserID not provided');
    }
  },

  postPresentationHelper: (res, userID, title) => {
    db.presentation.post(userID, title).then(result2 => {
      var pid = result2.rows[0].presentationID;
      if (pid) {
        db.presentation.get(pid).then(result3 => {
          if (result3.rows.length > 0) {
            res.send(result3.rows[0]);
          } else {
            res.send('No presentations with given ID')
          }
        }).catch(err => {
          res.status(500).send(err);
        })
      } else {
        res.send('no presentationID returned')
      }

    }).catch(err => {
      res.status(500).send(err + '#########');
    })
  },

  postPresentation: (req, res, next) => {
    var userID = req.body.userID;
    var title = req.body.title;
    if (userID) {
      db.presentation.getLastID(userID).then(result => {
        if (result.rows.length > 0) {
          var presentation = result.rows[0];
          var pid = presentation.presentationID;
          db.question.getQuestionsByPresentation(pid).then(qs => {
            if (qs.rows.length > 0) {
              // post new presentation
              module.exports.postPresentationHelper(res, userID, title);
            } else {
              // do not post new, just send back ID of last presentation
              res.send(presentation);
            }
          }).catch(err => {
            res.status(500).send(err);
          })

        } else {
          module.exports.postPresentationHelper(res, userID, title);
        }
      }).catch(err => {
        res.status(500).send(err);
      })

    } else {
      res.status(400).send('user ID not provided');
    }
  },

  updatePresentation: (req, res, next) => {
    var pid = req.params.pid;
    var title = req.body.title;
    if (pid) {
      db.presentation.update(title).then(result => {
        db.presentation.get(pid).then(result2 => {
          res.send(result2.rows[0]);
        }).catch(err => {
          res.status(500).send(err);
        })
      }).catch(err => {
        res.staus(500).send(err);
      })
    }
  },

  deletePresentation: (req, res, next) => {
    var pid = req.params.pid;
    db.presentation.get(pid).then(result => {
        db.presentation.delete(pid).then(result => {
          res.send('Presentation ' + pid + ' deleted');
        }).catch(err => {
          res.status(500).send(err);
        })
    }).catch(err => {
      res.status(500).send(err);
    })
  },

  getSession: (req, res, next) => {
    var socket = req.params.socket;
    if (socket) {
      db.session.getSessionBySocket(socket).then(result => {
        if (result.rows.length > 0) {
          res.send(result.rows[0]);
        } else {
          res.send('-1');
        }
      }).catch(err => {
        res.status(500).send(err);
      })
    } else {
      res.status(400).send('sessionID not found');
    }
  },

  getAllSessions: (req, res, next) => {
    db.session.getAll().then(result => {
      res.send(result.rows);
    }).catch(err => {
      res.status(500).send(err);
    })
  },

  postSession: (req, res, next) => {
    var pid = req.body.presentationID;
    var socket = req.body.socket;
    if (pid && socket) {
      db.session.post(pid, socket).then(result => {
        var sessionID = result.rows[0].sessionID;
        if (sessionID) {
          db.session.get(sessionID).then(result2 => {
            if (result2.rows.length > 0) {
              res.send(result2.rows[0]);
            } else {
              res.send('No sessions for given sessionID')
            }
          }).catch(err => {
            res.status(500).send(err);
          })
        } else {
          res.send('No sessionID returned')
        }
      }).catch(err => {
        res.status(500).send(err);
      })
    } else {
      res.status(400).send('pid or socket not provided');
    }
  },

  getResponseByQuestion: (req, res, next) => {
    var qid = req.params.qid;
    if (qid) {
      db.response.getResponseByQ(qid).then(result => {
        if (result.rows.length > 0) {
          res.send(result.rows);
        } else {
          res.send('No Responses for given Question ID');
        }
      }).catch(err => {
        res.status(500).send(err);
      })
    } else {
      res.status(400).send('qid not provided');
    }
  },

  getResponseBySession: (req, res, next) => {
    var sessionID = req.params.sessionID;
    if (sessionID) {
      db.response.getResponseByS(sessionID).then(result => {
        if (result.rows.length > 0) {
          res.send(result.rows);
        } else {
          res.send('No responses with given Session ID');
        }
      }).catch(err => {
        res.status(500).send(err);
      })
    } else {
      res.status(400).send('session ID not provided');
    }
  },

  getResponseByQandS: (req, res, next) => {
    var qid = req.params.qid;
    var sessionID = req.params.sessionID;
    if (qid && sessionID) {
      db.response.getResponseByQS(qid, sessionID).then(result => {
        if (result.rows.length > 0) {
          res.send(result.rows);
        } else {
          res.send('No responses for given question ID and sessionID')
        }
      }).catch(err => {
        res.status(500).send(err);
      })
    } else {
      res.status(400).send('Question Id or Session ID not provided');
    }
  },

  postResponse: (req, res, next) => {
    var response = req.body;
    if (req.body) {
      db.response.post(response.sessionID, response.userID, response.questionID, response.answerID, response.content).then(result => {
        if (result.rows[0].responseID) {
          db.response.get(result.rows[0].responseID).then(result2 => {
            if (result2.rows.length > 0) {
              res.send(result2.rows[0]);
            } else {
              res.send('No response found with given responseID');
            }
          }).catch(err => {
            res.status(500).send(err);
          })
        } else {
          res.send('posted without returning response ID')
        }
      }).catch(err => {
        res.status(500).send(err + 'asldf;lkjf');
      })
    } else {
      res.status(400).send('response body not provided');
    }
  },

  postMultiResponses: (req, res, next) => {
    // to be used after each unique question
    // sessionID and questionID will be constant
    var sessionID = req.body.sessionID;
    var qid = req.body.questionID;
    // response should contain userID, answerID, and content
    var response = req.body.response;
    if (sessionID && qid && response) {
      var responseString = '';
      for (var i = 0; i < response.length; i++) {
        responseString += '(' + sessionID + ', ' + response[i].userID + ', ' + qid + ', ' + response[i].answerID + ', \'' + response[i].content + '\'' + '), '
      }
      responseString = responseString.slice(0, responseString.length - 2);
      db.response.postMultiple(responseString).then(result => {
        res.send(result.rows);
      }).catch(err => {
        res.status(500).send(err);
      })
    } else {
      res.send(400).status('SessionID, or questionID, or response body not provided');
    }
  },
}

