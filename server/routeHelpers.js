var db = require('../db/helpers');

module.exports = {
  getAllUsers: (req, res, next) => {
    db.user.getAll().then(result => {
      res.status(200).send(result.rows);
    }).catch(err => {
      res.status(500).send(err);
    })
  },
  searchUsers: (req, res, next) => {
    if (req.params.search) {
      console.log(req.params.search);
      db.user.search(req.params.search).then(result => {
        if (result.rows.length > 0) {
          res.status(200).send(result.rows);
        } else {
          res.status(200).send('[]');
        }
      }).catch(err => {
        res.status(500).send(err);
      })
    } else  {
      res.status(400).send('search parameter not provided');
    }
  },
  getAnswer: (req, res, next) => {
    if (req.params.id) {
      db.answer.get(req.params.id).then(result => {
        if (result.rows.length > 0) {
          res.status(200).send(result.rows[0]);
        } else {
          res.status(500).send('invalid answer id provided');
        }
      }).catch(err => {
        res.status(500).send(err);
      })
    } else {
      res.status(400).send('answer ID not provided');
    }
  },

  getAnswers: (req, res, next) => {
    if (req.params.id) {
      db.answer.getAnswerByQuestion(req.params.id).then(result => {
        res.status(200).send(result.rows);
      }).catch(err => {
        res.status(500).send(err);
      })
    } else {
      res.status(400).send('question ID not provided');
    }
  },

  getAllAnswers: (req, res, next) => {
    db.answer.getAll().then(result => {
      res.status(200).send(result.rows);
    }).catch(err => {
      res.status(500).send(err + ' error with getting all ans');
    })
  },

  getCorrectAnswer: (req, res, next) => {
    var qid = req.params.qid;
    if (qid) {
      db.answer.getCorrect(qid).then(result => {
        res.status(200).send(result.rows);
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
            res.status(201).send(result2.rows[0]);
          } else {
            res.status(204).send('No answer found for given ID')
          }
        }).catch(err => {
          res.status(500).send(err);
        })
        } else {
          res.status(204).send('answerID not returned')
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
        res.status(201).send(result.rows);
      }).catch(err => {
        res.status(500).send(err + answerString);
      })

    } else {
      res.status(400).send('question ID/answers not provided');
    }
  },

  updateAnswer: (req, res, next) => {
    var answer = req.body.answer;
    var correct = req.body.correct;
    var aid = req.params.aid;
    if (answer && correct && aid) {
        db.answer.put(answer, correct, aid).then(result => {
          db.answer.get(aid).then(result2 => {
            if (result2.rows.length > 0) {
              res.status(200).send(result2.rows[0]);
            } else {
              res.status(204).send('No answer for given aID');
            }
          }).catch(err => {
            res.status(500).send(err);
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
        res.status(200).end();
      }).catch(err => {res.status(500).send(err)});
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
          db.user.post(login.type === undefined ? 1 : login.type, login.given_name, login.family_name, login.email ? login.email : '', '', login.auth_id).then(post => {
            db.user.getByAuth(login.auth_id).then(result2 => {
              res.status(200).send(result2.rows[0]);
            }).catch(err => {
              res.status(204).send('login doesn"t exist');
            })
          }).catch(err => {
            res.status(400).send(err);
          })
        }
      }).catch(err => {
        console.log(err);
        res.status(204).send('login doesn"t exist');
      })
    } else {
      res.status(400).send('login information not provided');
    }
  },

  getQuestion: (req, res, next) => {
    var id = req.params.id;
    if (id) {
      db.question.get(id).then(result => {
        if (result.rows.length > 0) {
          res.status(200).send(result.rows[0]);
        } else {
          res.status(500).send('no questions found for the given id:' + id);
        }
      }).catch(err => {
        res.status(500).send(err);
      })
    } else {
      res.status(400).send('id not provided');
    }
  },

  getQuestions: (req, res, next) => {
    var socket = req.params.socket;
    if (socket) {
      db.question.getQuestionsBySocket(socket).then(result => {
        if (result.rows.length > 0) {
          res.status(200).send(result.rows);
        } else {
          res.status(204).send('no questions found with given socket:' + socket);
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
        res.status(200).send(result.rows);
      } else {
        res.status(204).send('no questions found in database');
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
          res.status(200).send(result.rows);
        } else {
          res.status(204).send('no questions found with given presentationID');
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
            res.status(201).send(result2.rows[0]);
          } else {
            res.status(204).send('No question found with given qID');
          }
          }).catch(err => {
            res.status(500).send(err);
          })
        } else {
          res.status(400).send('No questionID returned');
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
            res.status(200).send(result2.rows[0]);
          } else {
            res.status(204).send('No question found for given ID');
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
            res.status(200).send('question ' + qid + ' deleted');
          }).catch(err => {
            res.status(500).send(err);
          })
        } else {
          res.status(204).send('No question found with given ID');
        }
      }).catch(err => {
        res.status(500).send(err);
      })
    } else {
      res.status(400).send('question ID not provided')
    }

  },

  getPresentation: (req, res, next) => {
    var id = req.params.id;
    if (id) {
      db.presentation.get(id).then(result => {
        if (result.rows.length > 0) {
          res.status(200).send(result.rows[0]);
        } else {
          res.status(500).send('no presentation found with given id:' + id);
        }
      }).catch(err => {
        res.status(500).send(err);
      })
    } else {
      res.status(400).send('id not provided');
    }
  },

  getPresentationByS: (req, res, next) => {
    var socket = req.params.socket;
    if (socket) {
      db.presentation.getPresBySocket(socket).then(result => {
        if (result.rows.length > 0) {
          res.status(200).send(result.rows[0]);
        } else {
          res.status(204).send('no presentation found with given socket:' + socket);
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
          res.status(200).send(result.rows);
        } else {
          res.status(204).send('no presentation found for given user');
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
          res.status(200).send(result.rows[0]);
        } else {
          res.status(204).send('No presentation found with given userID');
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
            res.status(201).send(result3.rows[0]);
          } else {
            res.status(204).send('No presentations with given ID')
          }
        }).catch(err => {
          res.status(500).send(err);
        })
      } else {
        res.status(400).send('no presentationID returned')
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
              res.status(200).send(presentation);
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
    if (pid && title) {
      db.presentation.put(title, pid).then(result => {
        db.presentation.get(pid).then(result2 => {
          res.status(200).send(result2.rows[0]);
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
    db.presentation.get(pid)
      .then(result => {
        db.presentation.delete(pid)
          .then(result => {
          res.status(200).send('Presentation ' + pid + ' deleted');
          })
          .catch(err => {
            res.status(500).send(err);
        })
      })
      .catch(err => { res.status(500).send(err); })
  },

  getSession: (req, res, next) => {
    var socket = req.params.socket;
    if (socket) {
      db.session.getSessionBySocket(socket).then(result => {
        if (result.rows.length > 0) {
          res.status(200).send(result.rows[0]);
        } else {
          res.status(200).send('-1');
        }
      }).catch(err => {
        res.status(500).send(err);
      })
    } else {
      res.status(400).send('sessionID not found');
    }
  },

  getLatestSessionByUser: (req, res, next) => {
    var userID = req.params.userID;
    if (userID) {
      db.session.getLastID(userID).then(result => {
         if (result.rows.length > 0) {
          res.status(200).send(result.rows[0]);
        } else {
          res.status(500).send('no session found with given id:' + id);
        }       
      })
    } else {
      res.status(400).send('userID not provided');
    }
  },
  getAllSessions: (req, res, next) => {
    db.session.getAll().then(result => {
      res.status(200).send(result.rows);
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
              res.status(201).send(result2.rows[0]);
            } else {
              res.status(204).send('No sessions for given sessionID')
            }
          }).catch(err => {
            res.status(500).send(err);
          })
        } else {
          res.status(400).send('No sessionID returned')
        }
      }).catch(err => {
        res.status(500).send(err);
      })
    } else {
      res.status(400).send('pid or socket not provided');
    }
  },
  updateSAsk: (req, res, next) => {
    var id = req.params.id;
    var flag = req.body.flag;
    if (id && flag) {
      db.session.putAsk(id, flag)
        .then(result => { res.status(200).send(result.rows[0]); })
        .catch(err => { res.status(500).send(err); })
    } else {
      res.status(400).send('id or flag not provided');
    }
  },
  updateSAudQ: (req, res, next) => {
    var id = req.params.id;
    var flag = req.body.flag;
    if (id && flag) {
      db.session.putAudQ(id, flag)
        .then(result => { res.status(200).send(result.rows[0]); })
        .catch(err => { res.status(500).send(err); })
    } else {
      res.status(400).send('id or flag not provided');
    }
  },
  getResponseByQuestion: (req, res, next) => {
    var qid = req.params.qid;
    if (qid) {
      db.response.getResponseByQ(qid).then(result => {
        if (result.rows.length > 0) {
          res.status(200).send(result.rows);
        } else {
          res.status(204).send('No Responses for given Question ID');
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
          res.status(200).send(result.rows);
        } else {
          res.status(204).send('No responses with given Session ID');
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
          res.status(200).send(result.rows);
        } else {
          res.status(204).send('No responses for given question ID and sessionID')
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
              res.status(201).send(result2.rows[0]);
            } else {
              res.status(204).send('No response found with given responseID');
            }
          }).catch(err => {
            res.status(500).send(err);
          })
        } else {
          res.status(400).send('posted without returning response ID')
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
        res.status(201).send(result.rows);
      }).catch(err => {
        res.status(500).send(err);
      })
    } else {
      res.status(400).send('SessionID, or questionID, or response body not provided');
    }
  },

  getAudQuestion: (req, res, next) => {
    var id = req.params.id;
    if (id) {
      db.audQuestion.get(id)
        .then(result => { res.status(200).send(result.rows[0]); })
        .catch(err => { res.status(500).send(err); });
    } else {
      res.status(400).send('id not provided');
    }
  },

  getAudQuestionBySession: (req, res, next) => {
    var sessionID = req.params.sessionID;
    if (sessionID) {
      db.audQuestion.getAudQuestionByS(sessionID)
        .then(result => { res.status(200).send(result.rows); })
        .catch(err => { res.status(500).send(err); });
    } else {
      res.status(400).send('session ID not provided');
    }
  },

  postAudQuestion: (req, res, next) => {
    var sessionID = req.body.sessionID;
    var userID = req.body.userID;
    var content = req.body.content;
    if (sessionID && userID && content) {
      db.audQuestion.post(sessionID, userID, content)
        .then(result => db.audQuestion.get(result.rows[0].audQuestionID))
        .then(result2 => { res.status(200).send(result2.rows[0]); })
        .catch(err => { res.status(500).send(err); });
    } else {
      res.status(400).send('response body not provided');
    }
  },

  updateAudQuestion: (req, res, next) => {
    var id = req.params.id;
    if (id) {
      db.audQuestion.put(id)
        .then(result2 => { res.status(200).send(id); })
        .catch(err => { res.status(500).send(err); })
    } else {
      res.status(400).send('audQuestionID not provided');
    }
  },

  postParticipant: (req, res, next) => {
    var sessionID = req.body.sessionID;
    var userID = req.body.userID;
    if (sessionID && userID) {
      db.participant.post(userID, sessionID)
      .then(result => db.participant.get(result.rows[0].participantID))
      .then(result2 => {res.status(200).send(result2.rows[0])})
      .catch(err => { res.status(500).send(err); });
    } else {
      res.status(400).send('sessionID or userID not provided');
    }
  },

  postGroupHelper: (res, userID, name) => {
      db.group.post(name, userID)
      .then(result => db.group.get(result.rows[0].groupID))
      .then(result2 => {res.status(200).send(result2.rows[0])})
      .catch(err => { res.status(500).send(err); });
  },

  postGroup: (req, res, next) => {
    var name = req.body.name;
    var userID = req.body.userID;
    if (name && userID) {
      db.group.getLastID(userID).then(result => {
        if (result.rows.length > 0) {
          var group = result.rows[0];
          var gid = group.groupID;
          db.groupMember.getByGroup(gid).then(gs => {
            if (gs.rows.length > 0) {
              // post new group
              module.exports.postGroupHelper(res, userID, name);
            } else {
              // do not post new, just send back ID of last group
              res.status(200).send(group);
            }            
          })
        } else {
          module.exports.postGroupHelper(res, userID, name);
        }
      });

    } else {
      res.status(400).send('name or userID not provided');
    }
  },

  updateGroup: (req, res, next) => {
    var groupID = req.params.groupID;
    var name = req.body.name;
    if (groupID && name) {
      db.group.put(name, groupID)
      .then(result => db.group.get(groupID))
      .then(result2 => {res.status(200).send(result2.rows[0])})
      .catch(err => { res.status(500).send(err); });
    } else {
      res.status(400).send('name not provided');
    }
  },
  getGroupByUser: (req, res, next) => {
    var userID = req.params.userID;
    if (userID) {
      db.group.getByUser(userID)
      .then(result => {res.status(200).send(result.rows);})
      .catch(err => { res.status(500).send(err); });
    } else {
      res.status(400).send('userID not provided');
    }
  },
  deleteGroup: (req, res, next) => {
    var groupID = req.params.groupID;
    if (groupID) {
      db.group.delete(groupID)
      .then(result => {res.status(200).send('Group ' + groupID + ' deleted');})
      .catch(err => { res.status(500).send(err); });
    } else {
      res.status(400).send('groupID not provided');
    }
  },
  postGroupMember: (req, res, next) => {
    var groupID = req.body.groupID;
    var userID = req.body.userID;
    if (groupID && userID) {
      db.groupMember.post(groupID, userID)
      .then(result => db.groupMember.get(result.rows[0].groupMemberID))
      .then(result2 => {res.status(200).send(result2.rows[0])})
      .catch(err => { res.status(500).send(err); });
    } else {
      res.status(400).send('groupID or userID not provided');
    }
  },
  getGroupMemberByGroup: (req, res, next) => {
    var groupID = req.params.groupID;
    if (groupID) {
      db.groupMember.getByGroup(groupID)
      .then(result => {res.status(200).send(result.rows);})
      .catch(err => { res.status(500).send(err); });
    } else {
      res.status(400).send('groupID not provided');
    }
  },
  deleteGroupMember: (req, res, next) => {
    var groupID = req.params.groupID;
    var userID = req.params.userID;
    if (groupID && userID) {
      db.groupMember.delete(groupID, userID)
      .then(result => {res.status(200).send('Group Member deleted');})
      .catch(err => { res.status(500).send(err); });
    } else {
      res.status(400).send('groupID or userID not provided');
    }
  },
}
