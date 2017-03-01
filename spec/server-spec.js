var expect = require('chai').expect;
var request = require('request');
var app = require('../server/routes.js');

describe('', function() {

  var server;
  var userID, presentationID, questionID, answerID, sessionID, responseID;
  before(function() {
    server = app.listen(4568, function() {
      console.log('Shortly is listening on 4568');
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

  describe('Deletes:', function() {
    var requestWithSession = request.defaults({jar: true});
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












// // Server spec
// // var handler = require('../request-handler');
// var expect = require('chai').expect;
// var stubs = require('./Stubs');
// var sinon = require('sinon');

// var headers = {
//   'access-control-allow-origin': '*',
//   'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
//   'access-control-allow-headers': 'content-type, accept',
//   'access-control-max-age': 10, // Seconds.
//   'Content-Type': 'application/json'
// };


// var waitForThen = function (test, cb) {
//   setTimeout(function() {
//     test() ? cb.apply(this) : waitForThen(test, cb);
//   }, 5);
// };

// describe('Node Server Request Listener Function', function() {

//   // before(function(done) {
//   //     cli.connect(err => {
//   //      cli.query('DELETE FROM "response" where "responseID" >= 0')
//   //     .then(cli.query('DELETE FROM "session" where "sessionID" >= 0'))
//   //     .then(cli.query('DELETE FROM "answer" where "answerID" >= 0'))
//   //     .then(cli.query('DELETE FROM "question" where "questionID" >= 0'))
//   //     .then(cli.query('DELETE FROM "presentation" where "presentationID" >= 0'))
//   //     .then(cli.query('DELETE FROM "user" where "userID" >= 0'))
//   //     .then(() => {done ()})
//   //     })
//   //   });

//   //   after(function() {
//   //     cli.end();
//   //   });

//   it('Should accept POSTS to /aByQ', function() {
//     var stubAnswer = {
//       questionID: -1,
//       answer: 'C',
//       correct: 0
//     };
//     var req = new stubs.request('/aByQ', 'POST', stubAnswer);
//     var res = new stubs.response();

//     handler.requestHandler(req, res);

//     // Expect 201 Created response status
//     expect(res._responseCode).to.equal(201);

//     // Testing for a newline isn't a valid test
//     // TODO: Replace with with a valid test
//     // expect(res._data).to.equal(JSON.stringify('\n'));
//     expect(res._ended).to.equal(true);
//   });

//   it('Should answer GET requests for /aByQ/:id with a 200 status code', function() {
//     // This is a fake server request. Normally, the server would provide this,
//     // but we want to test our function's behavior totally independent of the server code
//     var qID = -1;
//     var req = new stubs.request('/aByQ/:id', 'GET', qID);
//     var res = new stubs.response();

//     handler.requestHandler(req, res);

//     expect(res._responseCode).to.equal(200);
//     expect(res._ended).to.equal(true);
//   });

//   it('Should send back parsable stringified JSON', function() {
//     var req = new stubs.request('/aByQ/:id', 'GET', qID);
//     var res = new stubs.response();

//     handler.requestHandler(req, res);

//     expect(JSON.parse.bind(this, res._data)).to.not.throw();
//     expect(res._ended).to.equal(true);
//   });

//   it('Should send back an object', function() {
//     var req = new stubs.request('/aByQ/:id', 'GET', qID);
//     var res = new stubs.response();

//     handler.requestHandler(req, res);

//     var parsedBody = JSON.parse(res._data);
//     expect(parsedBody).to.be.an('object');
//     expect(res._ended).to.equal(true);
//   });

//   it('Should send an object containing certain properties', function() {
//     var req = new stubs.request('/classes/messages', 'GET', qID);
//     var res = new stubs.response();

//     handler.requestHandler(req, res);

//     var parsedBody = JSON.parse(res._data);
//     expect(parsedBody).to.have.property('email');
//     expect(parsedBody).to.have.property('firstName');
//     expect(res._ended).to.equal(true);
//   });


//   it('Should respond with messages that were previously posted', function() {
//     var stubAnswer = {
//       questionID: -1,
//       answer: 'B',
//       correct: 1
//     };
//     var req = new stubs.request('/aByQ/', 'POST', stubMsg);
//     var res = new stubs.response();

//     handler.requestHandler(req, res);

//     expect(res._responseCode).to.equal(201);

//       // Now if we request the log for that room the message we posted should be there:
//     req = new stubs.request('/aByQ/:id', 'GET');
//     res = new stubs.response();

//     handler.requestHandler(req, res);

//     expect(res._responseCode).to.equal(200);
//     var messages = JSON.parse(res._data).results;
//     expect(messages.length).to.be.above(0);
//     expect(messages[0].username).to.equal('Jono');
//     expect(messages[0].message).to.equal('Do my bidding!');
//     expect(res._ended).to.equal(true);
//   });


//   it('Should 404 when asked for a nonexistent file', function() {
//     var req = new stubs.request('/arglebargle', 'GET');
//     var res = new stubs.response();

//     handler.requestHandler(req, res);

//     // Wait for response to return and then check status code
//     waitForThen(
//       function() { return res._ended; },
//       function() {
//         expect(res._responseCode).to.equal(404);
//       });
//   });

// });