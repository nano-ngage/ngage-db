var db = require('./index');
var Promise = require('bluebird');



module.exports = {
  user: {
    truncate: () => db.query('DELETE FROM "user" where "userID" >= 0'),
    get: (id) => db.query('SELECT * FROM "user" where "userID" = $1', id),
    post: (type, firstName, lastName, email, password, authID) => db.query('INSERT INTO "user" ("type","firstName","lastName","email","password","authID") VALUES ($1, $2, $3, $4, $5, $6)', [type, firstName, lastName, email, password, authID])
  },
  presentation: {
    truncate: () => db.query('DELETE FROM "presentation" where "presentationID" >= 0'),
    get: (id) => db.query('SELECT * FROM "presentation" where "presentationID" = $1', id),
    post: (userID) => db.query('INSERT INTO "presentation" ("userID") VALUES ($1)', [userID])
  },
  question: {
    truncate: () => db.query('DELETE FROM "question" where "questionID" >= 0'),
    get: (id) => db.query('SELECT * FROM "question" WHERE "questionID" = $1', id),
    post: (presentationID, type, question) => db.query('INSERT INTO "question" ("presentationID","type", "question") VALUES ($1, $2, $3)', [presentationID, type, question])
  },
  answer: {
    truncate: () => db.query('DELETE FROM "answer" where "answerID" >= 0'),
    get: (id) => db.query('SELECT * FROM "answer" WHERE "answerID" = $1', id),
    post: (questionID, answer, correct) => db.query('INSERT INTO answer ("questionID", "answer", "correct") VALUES ($1, $2, $3)', [questionID, answer, correct])
  },
  session: {
    truncate: () => db.query('DELETE FROM "session" where "sessionID" >= 0'),
    get: (id) => db.query('SELECT * FROM "session" WHERE "sessionID" = $1', id),
    post: (presentationID, socket) => db.query('INSERT INTO "session" ("presentationID", "socket") VALUES ($1, $2)', [presentationID, socket])
  },
  response: {
    truncate: () => db.query('DELETE FROM "response" where "responseID" >= 0'),
    get: (id) => db.query('SELECT * FROM "response WHERE "responseID" = $1', id),
    post: (sessionID, userID, questionID, answerID, content) => db.query('SELECT * FROM response ("sessionID", "userID", "questionID", "answerID", "content") VALUES ($1, $2, $3, $4, $5)', [sessionID, userID, questionID, answerID, content])
  }
}