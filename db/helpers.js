var db = require('./index');
var Promise = require('bluebird');



module.exports = {
  user: {
    truncate: () => db.query('DELETE FROM "user" where "userID" >= 0'),
    get: (id) => db.query('SELECT * FROM "user" where "userID" = $1', [id]),
    getByAuth: (id) => db.query('SELECT * FROM "user" where "authID" = $1', [id]),
    post: (type, firstName, lastName, email, password, authID) => db.query('INSERT INTO "user" ("type","firstName","lastName","email","password","authID") VALUES ($1, $2, $3, $4, $5, $6)', [type, firstName, lastName, email, password, authID])
  },
  presentation: {
    truncate: () => db.query('DELETE FROM "presentation" where "presentationID" >= 0'),
    get: (id) => db.query('SELECT * FROM "presentation" where "presentationID" = $1', [id]),
    getLastID: (userID) => db.query('SELECT "presentationID" FROM "presentation" WHERE "userID" = $1 ORDER BY "timestamp" DESC LIMIT 1', [userID]),
    getPresBySocket: (socket) => db.query('SELECT "presentationID" FROM "session" WHERE "socket" = $1', [socket]),
    getPresByUser: (userID) => db.query('SELECT * FROM "presentation" WHERE "userID" = $1', [userID]),
    post: (userID) => db.query('INSERT INTO "presentation" ("userID") VALUES ($1)', [userID])
  },
  question: {
    truncate: () => db.query('DELETE FROM "question" where "questionID" >= 0'),
    get: (id) => db.query('SELECT * FROM "question" WHERE "questionID" = $1', [id]),
    getQuestionsBySocket: (socket) =>
      db.query('SELECT * FROM "question" INNER JOIN "session" ON "session"."presentationID" = "question"."presentationID" AND "session"."socket" = $1', [socket]),
    getQuestionsByPresentation: (presentationID) =>
      db.query('SELECT * FROM "question" WHERE "presentationID" = $1', [presentationID]),
    post: (presentationID, type, question) => db.query('INSERT INTO "question" ("presentationID", "type", "question") VALUES ($1, $2, $3)', [presentationID, type, question])
  },
  answer: {
    truncate: () => db.query('DELETE FROM "answer" where "answerID" >= 0'),
    get: () => db.query('SELECT * FROM "answer"'),
    getAnswerByQuestion: (id) => db.query('SELECT * FROM "answer" WHERE "questionID" = $1', [id]),
    getCorrect: (id) => db.query('SELECT * FROM "answer" WHERE "questionID" = $1 AND "correct" = $2', [id, 1]),
    post: (questionID, answer, correct) => db.query('INSERT INTO "answer" ("questionID", "answer", "correct") VALUES ($1, $2, $3)', [questionID, answer, correct]),
    postMultiple: (values) => db.query('INSERT INTO "answer" ("questionID", "answer", "correct") VALUES ' + values)
  },
  session: {
    truncate: () => db.query('DELETE FROM "session" where "sessionID" >= 0'),
    get: (id) => db.query('SELECT * FROM "session" WHERE "sessionID" = $1', [id]),
    getSessionBySocket: (socket) => db.query('SELECT "sessionID" FROM "session" WHERE "socket" = $1', [socket]),
    post: (presentationID, socket) => db.query('INSERT INTO "session" ("presentationID", "socket") VALUES ($1, $2)', [presentationID, socket])
  },
  response: {
    truncate: () => db.query('DELETE FROM "response" where "responseID" >= 0'),
    get: (id) => db.query('SELECT * FROM "response" WHERE "responseID" = $1', [id]),
    post: (sessionID, userID, questionID, answerID, content) => db.query('INSERT INTO "response" ("sessionID", "userID", "questionID", "answerID", "content") VALUES ($1, $2, $3, $4, $5)', [sessionID, userID, questionID, answerID, content])
  }
}