var pg = require('pg');
var expect = require('chai').expect;
var db = require('../db/helpers');
var Promise = require('bluebird');

describe('ngage DB', function() {
  var cli = new pg.Client('postgres://ephqygbj:sTgEHTHK82B7Rc9WVZ92y8PEcAKkm8zh@babar.elephantsql.com:5432/ephqygbj');
  cli.connect();

  it('Should create a new user', function(done) {
    db.user.post(0, 'anon', 'anon', 'anon@gmail.com', 0).then(post => {
      cli.query('SELECT * FROM "user"').then(res => {
        expect(res.rows.length).to.be.above(1);
        expect(res.rows[res.rows.length - 1].email).to.equal('anon@gmail.com');
        done();
      }).catch(e => {throw e;})
    }).catch(e => {throw e;})
  });

  it('Should create a new presentation', function(done) {
    // POST presentation with existing userID
    db.presentation.post(-1).then(res => {
      cli.query('SELECT * FROM "presentation"').then(res => {
        expect(res.rows.length).to.be.above(1);
        expect(res.rows[res.rows.length - 1].userID).to.equal(-1);
        done();
      }).catch(e => {throw e;})
    }).catch(e => {throw e;})
  })

  it('Should create a new question', function(done) {
    var queryString = 'Would a woodchuck chuck?'
    db.question.post(-1, 0, queryString).then(res => {
      cli.query('SELECT * FROM "question"').then(res => {
        expect(res.rows.length).to.be.above(1);
        expect(res.rows[res.rows.length - 1].presentationID).to.equal(-1);
        expect(res.rows[res.rows.length - 1].type).to.equal(0);
        expect(res.rows[res.rows.length - 1].question).to.equal(queryString);
        done();
      }).catch(e => {throw e;})
    }).catch(e => {throw e;})
  })

   it('Should create a new answer', function(done) {
    // POST test
    db.answer.post(-1, 'A', 1).then(res => {
      db.answer.post(-1, 'B', 0).then(res => {
        cli.query('SELECT * FROM "answer"').then(res => {
          expect(res.rows).to.have.length.above(1);
          expect(res.rows[res.rows.length - 1].answer).to.equal('B');
          expect(res.rows[res.rows.length - 1].correct).to.equal(0);
          expect(res.rows[res.rows.length - 2].answer).to.equal('A');
          expect(res.rows[res.rows.length - 2].correct).to.equal(1);
          done();
        }).catch(e => {throw e;})
      }).catch(e => {throw e;})
    }).catch(e => {throw e;})

    // GET test
    db.answer.get(1).then(res => {
      expect(res.rows.length).to.be.equal(1);
      expect(res.rows[0].answer).to.be.equal('B');
      expect(res.rows[0].correct).to.be.equal(0);
      done();
    }).catch(e => {throw e;})

  })

  it('Should create a new session', function(done) {
    var socketString = 'test1';
    // POST test
    db.session.post(-1, socketString).then(res => {
      cli.query('SELECT * FROM "session"').then(res => {
        expect(res.rows).to.have.length.above(1);
        expect(res.rows[res.rows.length - 1].presentationID).to.equal(-1);
        expect(res.rows[res.rows.length - 1].socket).to.equal(socketString);
        done();
      }).catch(e => {throw e;})
    }).catch(e => {throw e;})

    // GET test
    db.session.get(0).then(res => {
      expect(res.rows.length).to.be.equal(1);
      expect(res.rows[0]).socket.to.be.equal(socketString);
      done();
    }).catch(e => {throw e;})
  })

  it('Should create a new response', function(done) {
    var content = "I\'m responding to a question!";

    db.response.post(-1,-1, -1, -1, content).then(res => {
      cli.query('SELECT * FROM "response"').then(res => {
        expect(res.rows).to.have.length.above(1);
        expect(res.rows[res.rows.length - 1].sessionID).to.equal(-1);
        expect(res.rows[res.rows.length - 1].userID).to.equal(-1);
        expect(res.rows[res.rows.length - 1].questionID).to.equal(-1);
        expect(res.rows[res.rows.length - 1].answerID).to.equal(-1);
        expect(res.rows[res.rows.length - 1].content).to.equal(content);
        done();
      }).catch(e => {throw e;})
    }).catch(e => {throw e;})

    // test GET
    db.response.get(0).then(res => {
      expect(res.rows).to.exist;
      expect(res.rows[0].userID).to.equal(-1);
      expect(res.rows[0].content).to.equal(content);
      done();
    }).catch(e => {throw e;})
  })

});