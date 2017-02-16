var pg = require('pg');
var expect = require('chai').expect;
var db = require('./db/helpers');
var Promise = require('bluebird');

describe('ngage DB', function() {
  var cli = new pg.Client('postgres://ephqygbj:sTgEHTHK82B7Rc9WVZ92y8PEcAKkm8zh@babar.elephantsql.com:5432/ephqygbj');
  cli.connect();
  var q = Promise.promisify(cli.query);
  // var
  // beforeEach(function(done) {
  //   cli.connect();

  // });
  // afterEach(function() {
  //   cli.end();
  // });


  it('Should create a new user', function(done) {
    db.user.post(0, 'anon', 'anon', 'anon@gmail.com', 0).then(res => {
        q('SELECT * FROM user', [], function(err, results) {
          if (err) {
            throw err;
          } else {
            expect(results.length).to.equal(1);
            expect(results[0].email).to.equal('anon@gmail.com');
            done();
          }
        })
    })
  });

  it('Should create a new presentation', function(done) {
    // POST presentation with existing userID
    db.presentation.post(1).then(res => {
      q('SELECT * FROM presentation', [], function(err, results) {
        if (err) {
          throw err;
        } else {
          expect(results.length).to.equal(1);
          expect(results[0].userID).to.equal(1);
          done();
        }
      })
    })
  })

  it('Should create a new question', function(done) {
    var queryString = 'Would a woodchuck chuck?'
    db.question.post(0, queryString).then(res => {
      q('SELECT * FROM question', [], function(err, results) {
        if (err) {
          throw err;
        } else {
          expect(results.length).to.equal(1);
          expect(results[0].type).to.equal(0);
          expect(results[0].question).to.equal(queryString);
          done();
        }
      })
    })
  })
}