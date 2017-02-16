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
    })
  });

  it('Should create a new presentation', function(done) {
    // POST presentation with existing userID
    db.presentation.post(-1).then(res => {
      cli.query('SELECT * FROM "presentation"').then(res => {
        expect(res.rows.length).to.be.above(1);
        expect(res.rows[res.rows.length - 1].userID).to.equal(-1); 
        done();        
      }).catch(e => {throw e;})
    }).catch(e => {
      throw e;
    })
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
    })
  })
});