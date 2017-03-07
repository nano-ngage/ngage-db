var expect = require('chai').expect;
var request = require('request');
var app = require('../server/routes.js');

describe('Server Tests', function() {

  var server;
  var userID, presentationID, questionID, answerID, sessionID, responseID, audQuestionID, groupID;
  before(function() {
    server = app.listen(4568, function() {
      console.log('nGage DB is listening on 4568');
    });
  });

  after(function() {
    server.close();
  });
  describe('User:', function() {
    var requestWithSession = request.defaults({jar: true});
    it('Logs in with a user', function(done) {
      var options = {
        'method': 'POST',
        'uri': 'http://127.0.0.1:4568/login',
        'json': {
          'given_name': 'User',
          'family_name': 'Test',
          'email': 'test@test.com',
          'auth_id': 'testauthid',
          'type': 0
        }
      };
      requestWithSession(options, function(error, res, body) {
        expect(body).to.be.a('object');
        expect(body.userID).to.exist;
        expect(body.userID).to.be.a('number');
        userID = body.userID;
        done();
      });
    });

    it('Searches for and finds user', function(done) {
      var options = {
        'method': 'GET',
        'uri': `http://127.0.0.1:4568/searchU/User`,
      };
      requestWithSession(options, function(error, res, body) {
        var parsedBody = JSON.parse(body);
        expect(parsedBody).to.be.a('array');
        expect(parsedBody[0].firstName).to.exist;
        expect(parsedBody[0].firstName).to.equal('User');
        expect(parsedBody.length).to.be.above(0);
        //responseID = body.responseID;
        done();
      });
    });
  });

  describe('Presentation:', function() {
    var requestWithSession = request.defaults({jar: true});
    it('Posts a presentation to the database and returns the presentation ID', function(done) {
      var options = {
        'method': 'POST',
        'uri': 'http://127.0.0.1:4568/pByU',
        'json': {
          'userID': userID,
          'title': 'This is a test title'
        }
      };
      requestWithSession(options, function(error, res, body) {
        expect(body).to.be.a('object');
        expect(body.presentationID).to.exist;
        expect(body.presentationID).to.be.a('number');
        presentationID = body.presentationID;
        done();
      });
    });
    it('Updates a presentation on the database and returns the new presentation', function(done) {
      var options = {
        'method': 'PUT',
        'uri': `http://127.0.0.1:4568/p/${presentationID}`,
        'json': {
          'title': 'This is an updated test title'
        }
      };
      requestWithSession(options, function(error, res, body) {
        expect(body).to.be.a('object');
        expect(body.title).to.exist;
        expect(body.title).to.be.equal('This is an updated test title');
        done();
      });
    });

    it('Returns presentations by user ID', function(done) {
      var options = {
        'method': 'GET',
        'uri': `http://127.0.0.1:4568/pByU/${userID}`,
      };
      requestWithSession(options, function(error, res, body) {
        var parsedBody = JSON.parse(body);
        expect(parsedBody).to.be.a('array');
        expect(parsedBody[0].presentationID).to.exist;
        expect(parsedBody[0].presentationID).to.be.a('number');
        expect(parsedBody.length).to.be.above(0);
        //responseID = body.responseID;
        done();
      });
    });

    it('Returns latest presentation by user ID', function(done) {
      var options = {
        'method': 'GET',
        'uri': `http://127.0.0.1:4568/pByULatest/${userID}`,
      };
      requestWithSession(options, function(error, res, body) {
        var parsedBody = JSON.parse(body);
        expect(parsedBody).to.be.a('object');
        expect(parsedBody.presentationID).to.exist;
        expect(parsedBody.presentationID).to.be.a('number');
        expect(parsedBody.presentationID).to.equal(presentationID);
        //responseID = body.responseID;
        done();
      });
    });
  });

  describe('Question:', function() {
    var requestWithSession = request.defaults({jar: true});
    it('Posts a question to the database and returns the question ID', function(done) {
      var options = {
        'method': 'POST',
        'uri': 'http://127.0.0.1:4568/qByP',
        'json': {
          'presentationID': presentationID,
          'type': 1,
          'question': 'Who are you?'
        }
      };
      requestWithSession(options, function(error, res, body) {
        expect(body).to.be.a('object');
        expect(body.questionID).to.exist;
        expect(body.questionID).to.be.a('number');
        questionID = body.questionID;
        done();
      });
    });
    it('Updates a question on the database and returns the new question', function(done) {
      var options = {
        'method': 'PUT',
        'uri': `http://127.0.0.1:4568/q/${questionID}`,
        'json': {
          'question': 'Why are you?',
          'type': 1
        }
      };
      requestWithSession(options, function(error, res, body) {
        expect(body).to.be.a('object');
        expect(body.question).to.exist;
        expect(body.question).to.be.equal('Why are you?');
        done();
      });
    });


    it('Returns questions by presentation ID', function(done) {
      var options = {
        'method': 'GET',
        'uri': `http://127.0.0.1:4568/qByP/${presentationID}`,
      };
      requestWithSession(options, function(error, res, body) {
        var parsedBody = JSON.parse(body);
        expect(parsedBody).to.be.a('array');
        expect(parsedBody[0].questionID).to.exist;
        expect(parsedBody[0].questionID).to.be.a('number');
        expect(parsedBody.length).to.be.above(0);
        //responseID = body.responseID;
        done();
      });
    });


    it('Returns all questions', function(done) {
      var options = {
        'method': 'GET',
        'uri': `http://127.0.0.1:4568/qAll`,
      };
      requestWithSession(options, function(error, res, body) {
        var parsedBody = JSON.parse(body);
        expect(parsedBody).to.be.a('array');
        expect(parsedBody[0].questionID).to.exist;
        expect(parsedBody[0].questionID).to.be.a('number');
        expect(parsedBody.length).to.be.above(0);
        //responseID = body.responseID;
        done();
      });
    });
  });




  describe('Answer:', function() {
    var requestWithSession = request.defaults({jar: true});
    it('Posts a answer to the database and returns the answer ID', function(done) {
      var options = {
        'method': 'POST',
        'uri': 'http://127.0.0.1:4568/aByQ',
        'json': {
          'questionID': questionID,
          'answer': 'Just because',
          'correct': "1"
        }
      };
      requestWithSession(options, function(error, res, body) {
        expect(body).to.be.a('object');
        expect(body.answerID).to.exist;
        expect(body.answerID).to.be.a('number');
        answerID = body.answerID;
        done();
      });
    });
    it('Updates a answer on the database and returns the new answer', function(done) {
      var options = {
        'method': 'PUT',
        'uri': `http://127.0.0.1:4568/a/${answerID}`,
        'json': {
          'answer': 'Just because again',
          'correct': "1"
        }
      };
      requestWithSession(options, function(error, res, body) {
        expect(body).to.be.a('object');
        expect(body.answer).to.exist;
        expect(body.answer).to.be.equal('Just because again');
        done();
      });
    });
    it('Posts multiple answers to the database and returns multiple answer IDs', function(done) {
      var options = {
        'method': 'POST',
        'uri': 'http://127.0.0.1:4568/aByQs',
        'json': {
          'questionID': questionID,
          'answers': [{answer:"A", correct:false},{answer:"B", correct:false}]
        }
      };
      requestWithSession(options, function(error, res, body) {
        expect(body).to.be.a('array');
        expect(body.length).to.be.equal(2);
        done();
      });
    });
    it('Returns all answers', function(done) {
      var options = {
        'method': 'GET',
        'uri': `http://127.0.0.1:4568/aAll`,
      };
      requestWithSession(options, function(error, res, body) {
        var parsedBody = JSON.parse(body);
        expect(parsedBody).to.be.a('array');
        expect(parsedBody[0].answerID).to.exist;
        expect(parsedBody[0].answerID).to.be.a('number');
        expect(parsedBody.length).to.be.above(0);
        //responseID = body.responseID;
        done();
      });
    });
    it('Returns answers for a given question ID', function(done) {
      var options = {
        'method': 'GET',
        'uri': `http://127.0.0.1:4568/aByQ/${questionID}`,
      };
      requestWithSession(options, function(error, res, body) {
        var parsedBody = JSON.parse(body);
        expect(parsedBody).to.be.a('array');
        expect(parsedBody[0].answerID).to.exist;
        expect(parsedBody[0].answerID).to.be.a('number');
        expect(parsedBody.length).to.be.above(0);
        //responseID = body.responseID;
        done();
      });
    });
    it('Returns correct answers for a given question ID', function(done) {
      var options = {
        'method': 'GET',
        'uri': `http://127.0.0.1:4568/aByCorrect/${questionID}`,
      };
      requestWithSession(options, function(error, res, body) {
        var parsedBody = JSON.parse(body);
        expect(parsedBody).to.be.a('array');
        expect(parsedBody[0].answerID).to.exist;
        expect(parsedBody[0].answerID).to.be.a('number');
        expect(parsedBody.length).to.be.above(0);
        expect(parsedBody[0].answerID).to.equal(answerID);
        done();
      });
    });
  });


  describe('Session:', function() {
    var requestWithSession = request.defaults({jar: true});
    it('Posts a session to the database and returns the session ID', function(done) {
      var options = {
        'method': 'POST',
        'uri': 'http://127.0.0.1:4568/sByPS',
        'json': {
          'presentationID': presentationID,
          'socket': 'socket'
        }
      };
      requestWithSession(options, function(error, res, body) {
        expect(body).to.be.a('object');
        expect(body.sessionID).to.exist;
        expect(body.sessionID).to.be.a('number');
        sessionID = body.sessionID;
        done();
      });
    });

    it('Returns all sessions', function(done) {
      var options = {
        'method': 'GET',
        'uri': `http://127.0.0.1:4568/sAll`,
      };
      requestWithSession(options, function(error, res, body) {
        var parsedBody = JSON.parse(body);
        expect(parsedBody).to.be.a('array');
        expect(parsedBody[0].sessionID).to.exist;
        expect(parsedBody[0].sessionID).to.be.a('number');
        expect(parsedBody.length).to.be.above(0);
        //responseID = body.responseID;
        done();
      });
    });

    it('Returns latest session by user', function(done) {
      var options = {
        'method': 'GET',
        'uri': `http://127.0.0.1:4568/sByULatest/${userID}`,
      };
      requestWithSession(options, function(error, res, body) {
        var parsedBody = JSON.parse(body);
        expect(parsedBody).to.be.a('object');
        expect(parsedBody.sessionID).to.exist;
        expect(parsedBody.sessionID).to.be.a('number');
        expect(parsedBody.sessionID).to.equal(sessionID);
        //responseID = body.responseID;
        done();
      });
    });

    it('Returns session based on socket', function(done) {
      var options = {
        'method': 'GET',
        'uri': `http://127.0.0.1:4568/sByS/socket`,
      };
      requestWithSession(options, function(error, res, body) {
        var parsedBody = JSON.parse(body);
        expect(parsedBody).to.be.a('object');
        expect(parsedBody.sessionID).to.exist;
        expect(parsedBody.sessionID).to.be.a('number');
        expect(parsedBody.sessionID).to.equal(sessionID);
        expect(parsedBody.title).to.equal('This is an updated test title')
        //responseID = body.responseID;
        done();
      });
    });
    it('Returns questions by socket', function(done) {
      var options = {
        'method': 'GET',
        'uri': `http://127.0.0.1:4568/qByS/socket`,
      };
      requestWithSession(options, function(error, res, body) {
        var parsedBody = JSON.parse(body);
        expect(parsedBody).to.be.a('array');
        expect(parsedBody[0].questionID).to.exist;
        expect(parsedBody[0].questionID).to.be.a('number');
        expect(parsedBody.length).to.be.above(0);
        //responseID = body.responseID;
        done();
      });
    });
  });

  describe('Response:', function() {
    var requestWithSession = request.defaults({jar: true});
    it('Posts a response to the database and returns the response ID', function(done) {
      var options = {
        'method': 'POST',
        'uri': 'http://127.0.0.1:4568/r',
        'json': {
          'questionID': questionID,
          'sessionID': sessionID,
          'userID': -1,
          'content': null,
          'answerID': answerID
        }
      };
      requestWithSession(options, function(error, res, body) {
        expect(body).to.be.a('object');
        expect(body.responseID).to.exist;
        expect(body.responseID).to.be.a('number');
        responseID = body.responseID;
        done();
      });
    });

    it('Returns response based on question ID', function(done) {
      var options = {
        'method': 'GET',
        'uri': `http://127.0.0.1:4568/rByQ/${questionID}`,
      };
      requestWithSession(options, function(error, res, body) {
        var parsedBody = JSON.parse(body);
        expect(parsedBody).to.be.a('array');
        expect(parsedBody[0].responseID).to.exist;
        expect(parsedBody[0].responseID).to.be.a('number');
        expect(parsedBody.length).to.be.equal(1);
        //responseID = body.responseID;
        done();
      });
    });

    it('Returns response based on session ID', function(done) {
      var options = {
        'method': 'GET',
        'uri': `http://127.0.0.1:4568/rByS/${sessionID}`,
      };
      requestWithSession(options, function(error, res, body) {
        var parsedBody = JSON.parse(body);
        expect(parsedBody).to.be.a('array');
        expect(parsedBody[0].responseID).to.exist;
        expect(parsedBody[0].responseID).to.be.a('number');
        expect(parsedBody.length).to.be.equal(1);
        //responseID = body.responseID;
        done();
      });
    });

    it('Returns response based on question ID and session ID', function(done) {
      var options = {
        'method': 'GET',
        'uri': `http://127.0.0.1:4568/rByQS/${questionID}/${sessionID}`,
      };
      requestWithSession(options, function(error, res, body) {
        var parsedBody = JSON.parse(body);
        expect(parsedBody).to.be.a('array');
        expect(parsedBody[0].responseID).to.exist;
        expect(parsedBody[0].responseID).to.be.a('number');
        expect(parsedBody.length).to.be.equal(1);
        //responseID = body.responseID;
        done();
      });
    });
  });

  describe('AudQuestion:', function() {
    var requestWithSession = request.defaults({jar: true});
    it('Posts an audQuestion to the DB and returns the audQuestionID', function(done) {
      var options = {
        'method': 'POST',
        'uri': 'http://127.0.0.1:4568/aqByS',
        'json': {
          'sessionID': sessionID,
          'userID': -1,
          'content': 'Why are ents awesome?'
        }
      };
      requestWithSession(options, function(error, res, body) {
        expect(body).to.be.a('object');
        expect(body.audQuestionID).to.exist;
        expect(body.audQuestionID).to.be.a('number');
        audQuestionID = body.audQuestionID;
        expect(body.upvotes).to.be.a('number');
        expect(body.sessionID).to.equal(sessionID);
        done();
      });
    });

    it('Returns an audQuestion based on sessionID', function(done) {
      var options = {
        'method': 'GET',
        'uri': `http://127.0.0.1:4568/aqByS/${sessionID}`
      };
      requestWithSession(options, function(err, res, body) {
        var parsedBody = JSON.parse(body);
        expect(parsedBody).to.be.an('array');
        expect(parsedBody[0].audQuestionID).to.exist;
        expect(parsedBody[0].audQuestionID).to.be.a('number');
        expect(parsedBody.length).to.equal(1);
        done();
      })
    });

    it('Updates an audQuestion\'s upvote by 1', function(done) {
      var getOptions = {
        'method': 'GET',
        'uri': `http://127.0.0.1:4568/aq/${audQuestionID}`
      };
      var putOptions = {
        'method': 'PUT',
        'uri': `http://127.0.0.1:4568/aq/${audQuestionID}`
      };

      requestWithSession(getOptions, function(err, res, body) {
        var oldUpvotes = JSON.parse(body).upvotes;

        requestWithSession(putOptions, function(err, res, body) {
          var parsedID = parseInt(body)
          expect(body).to.exist;
          expect(parsedID).to.be.a('number');
          expect(parsedID).to.equal(audQuestionID);

          requestWithSession(getOptions, function(err, res, body) {
            var newUpvotes = JSON.parse(body).upvotes;
            expect(newUpvotes).to.equal(oldUpvotes + 1);
            done();
          });

        });
      });

    });
  });

  describe('Participant:', function() {
    var requestWithSession = request.defaults({jar: true});
    it('Posts a participant to the database and returns the participant ID', function(done) {
      var options = {
        'method': 'POST',
        'uri': 'http://127.0.0.1:4568/pa',
        'json': {
          'sessionID': sessionID,
          'userID': userID
        }
      };
      requestWithSession(options, function(error, res, body) {
        expect(body).to.be.a('object');
        expect(body.participantID).to.exist;
        expect(body.participantID).to.be.a('number');
        done();
      });
    });
  });

  describe('Group:', function() {
    var requestWithSession = request.defaults({jar: true});
    it('Posts a group to the database and returns the group ID', function(done) {
      var options = {
        'method': 'POST',
        'uri': 'http://127.0.0.1:4568/g',
        'json': {
          'name': 'oldname',
          'userID': userID
        }
      };
      requestWithSession(options, function(error, res, body) {
        expect(body).to.be.a('object');
        expect(body.groupID).to.exist;
        expect(body.groupID).to.be.a('number');
        groupID = body.groupID;
        done();
      });
    });

    it('Updates a group on the database and returns the new group', function(done) {
      var options = {
        'method': 'PUT',
        'uri': `http://127.0.0.1:4568/g/${groupID}`,
        'json': {
          'name': 'HR52'
        }
      };
      requestWithSession(options, function(error, res, body) {
        expect(body).to.be.a('object');
        expect(body.name).to.exist;
        expect(body.name).to.be.equal('HR52');
        done();
      });
    });


    it('Returns group based on user ID', function(done) {
      var options = {
        'method': 'GET',
        'uri': `http://127.0.0.1:4568/gByU/${userID}`,
      };
      requestWithSession(options, function(error, res, body) {
        var parsedBody = JSON.parse(body);
        expect(parsedBody).to.be.a('array');
        expect(parsedBody[0].groupID).to.exist;
        expect(parsedBody[0].groupID).to.be.a('number');
        expect(parsedBody.length).to.be.equal(1);
        //responseID = body.responseID;
        done();
      });
    });
  });

  describe('Group Member:', function() {
    var requestWithSession = request.defaults({jar: true});
    it('Posts a group member to the database and returns the group member ID', function(done) {
      var options = {
        'method': 'POST',
        'uri': 'http://127.0.0.1:4568/gm',
        'json': {
          'groupID': groupID,
          'userID': userID
        }
      };
      requestWithSession(options, function(error, res, body) {
        expect(body).to.be.a('object');
        expect(body.groupMemberID).to.exist;
        expect(body.groupMemberID).to.be.a('number');
        groupMemberID = body.groupMemberID;
        done();
      });
    });

    it('Returns group members based on group ID', function(done) {
      var options = {
        'method': 'GET',
        'uri': `http://127.0.0.1:4568/gmByG/${groupID}`,
      };
      requestWithSession(options, function(error, res, body) {
        var parsedBody = JSON.parse(body);
        expect(parsedBody).to.be.a('array');
        expect(parsedBody[0].groupMemberID).to.exist;
        expect(parsedBody[0].groupMemberID).to.be.a('number');
        expect(parsedBody.length).to.be.equal(1);
        //responseID = body.responseID;
        done();
      });
    });
  });



  // ---------------------------------------------
  // Have delete related tests at the end as the
  // other tests rely on consistent tables (i.e. not
  // deleting rows while testing them)
  // ---------------------------------------------
  describe('Deletes:', function() {
    var requestWithSession = request.defaults({jar: true});

    it('Deletes a group member and returns a valid status code', function(done) {
      var options = {
        'method': 'DELETE',
        'uri': `http://127.0.0.1:4568/gm/${groupID}/${userID}`,
      };
      requestWithSession(options, function(error, res, body) {
        expect(res.statusCode).to.equal(200);
        done();
      });
    });

    it('Deletes a group and returns a valid status code', function(done) {
      var options = {
        'method': 'DELETE',
        'uri': `http://127.0.0.1:4568/g/${groupID}`,
      };
      requestWithSession(options, function(error, res, body) {
        expect(res.statusCode).to.equal(200);
        done();
      });
    });

    it('Deletes an answer and returns a valid status code', function(done) {
      var options = {
        'method': 'DELETE',
        'uri': `http://127.0.0.1:4568/a/${answerID}`,
      };
      requestWithSession(options, function(error, res, body) {
        expect(res.statusCode).to.equal(200);
        done();
      });
    });
    it('tries to get the deleted answer and returns a not found error', function(done) {
      var options = {
        'method': 'GET',
        'uri': `http://127.0.0.1:4568/a/${answerID}`,
      };
      requestWithSession(options, function(error, res, body) {
        console.log(res.statusCode);
        expect(res.statusCode).to.equal(500);
        done();
      });
    });
    it('Deletes an question and returns a valid status code', function(done) {
      var options = {
        'method': 'DELETE',
        'uri': `http://127.0.0.1:4568/q/${questionID}`,
      };
      requestWithSession(options, function(error, res, body) {
        expect(res.statusCode).to.equal(200);
        done();
      });
    });
    it('tries to delete same question and returns a invalid status code', function(done) {
      var options = {
        'method': 'GET',
        'uri': `http://127.0.0.1:4568/q/${questionID}`,
      };
      requestWithSession(options, function(error, res, body) {
        expect(res.statusCode).to.equal(500);
        done();
      });
    });
    it('Deletes an answer and returns a valid status code', function(done) {
      var options = {
        'method': 'DELETE',
        'uri': `http://127.0.0.1:4568/p/${presentationID}`,
      };
      requestWithSession(options, function(error, res, body) {
        expect(res.statusCode).to.equal(200);
        done();
      });
    });
    it('tries to delete same question and returns a invalid status code', function(done) {
      var options = {
        'method': 'GET',
        'uri': `http://127.0.0.1:4568/p/${presentationID}`,
      };
      requestWithSession(options, function(error, res, body) {
        expect(res.statusCode).to.equal(500);
        done();
      });
    });
  });

})
