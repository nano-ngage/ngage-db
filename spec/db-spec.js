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

    })
  });
}