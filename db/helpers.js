var db = require('./index');
var Promise = require('bluebird');



module.exports = {
  user: {
    truncate: () => db.query('DELETE FROM "user" where "userID" >= 0'),
    get: (id) => db.query('SELECT * FROM "user" where "userID" = $1', [id]),
    getAll: () => db.query('SELECT * FROM "user"'),
    getByAuth: (id) => db.query('SELECT * FROM "user" where "authID" = $1', [id]),
    post: (type, firstName, lastName, email, password, authID) => db.query('INSERT INTO "user" ("type","firstName","lastName","email","password","authID") VALUES ($1, $2, $3, $4, $5, $6) RETURNING "userID"', [type, firstName, lastName, email, password, authID])
  },
  presentation: {
    truncate: () => db.query('DELETE FROM "presentation" where "presentationID" >= 0'),
    get: (id) => db.query('SELECT * FROM "presentation" where "presentationID" = $1', [id]),
    getLastID: (userID) => db.query('SELECT "presentationID" FROM "presentation" WHERE "userID" = $1 ORDER BY "updatedAt" DESC LIMIT 1', [userID]),
    getPresBySocket: (socket) => db.query('SELECT "presentationID" FROM "session" WHERE "socket" = $1', [socket]),
    getPresByUser: (userID) => db.query('SELECT * FROM "presentation" WHERE "userID" = $1', [userID]),
    post: (userID, title) => db.query('INSERT INTO "presentation" ("userID", "title") VALUES ($1, $2) RETURNING "presentationID"', [userID, title]),
    update: (title, pid) => db.query('UPDATE "presentation" SET "title" = $1 WHERE "presentationID" = $2', [title, pid]),
    delete: (pid) => db.query('DELETE FROM "presentation" WHERE "presentationID" = $1', [pid]),
  },
  question: {
    truncate: () => db.query('DELETE FROM "question" where "questionID" >= 0'),
    get: (id) => db.query('SELECT * FROM "question" WHERE "questionID" = $1', [id]),
    getAll: () => db.query('SELECT * FROM "question"'),
    getQuestionsBySocket: (socket) =>
      db.query('SELECT DISTINCT "question", "questionID", "type" FROM "question" INNER JOIN "session" ON "session"."presentationID" = "question"."presentationID" AND "session"."socket" = $1', [socket]),
    getQuestionsByPresentation: (presentationID) =>
      db.query('SELECT * FROM "question" WHERE "presentationID" = $1', [presentationID]),
    post: (presentationID, type, question) => db.query('INSERT INTO "question" ("presentationID", "type", "question") VALUES ($1, $2, $3) RETURNING "questionID"', [presentationID, type, question]),
    put: (type, question, qid) => db.query('UPDATE "question" SET "type" = $1, "question" = $2 WHERE "questionID" = $3', [type, question, qid]),
    delete: (qid) => db.query('DELETE FROM "question" WHERE "questionID" = $1', [qid]),
  },
  answer: {
    truncate: () => db.query('DELETE FROM "answer" where "answerID" >= 0'),
    get: (id) => db.query('SELECT * FROM "answer" WHERE "answerID" = $1', [id]),
    getAll: () => db.query('SELECT * FROM "answer"'),
    getAnswerByQuestion: (id) => db.query('SELECT * FROM "answer" WHERE "questionID" = $1', [id]),
    getCorrect: (id) => db.query('SELECT * FROM "answer" WHERE "questionID" = $1 AND "correct" = $2', [id, 1]),
    post: (questionID, answer, correct) => db.query('INSERT INTO "answer" ("questionID", "answer", "correct") VALUES ($1, $2, $3) RETURNING "answerID"', [questionID, answer, correct]),
    postMultiple: (values) => db.query('INSERT INTO "answer" ("questionID", "answer", "correct") VALUES ' + values + ' RETURNING "answerID"'),
    update: (answer, correct, id) => db.query('UPDATE "answer" SET "answer" = $1, "correct" = $2 WHERE "answerID" = $3', [answer, correct, id]),
    delete: (id) => db.query('DELETE FROM "answer" WHERE "answerID" IN ' + id),
  },
  session: {
    truncate: () => db.query('DELETE FROM "session" where "sessionID" >= 0'),
    get: (id) => db.query('SELECT * FROM "session" WHERE "sessionID" = $1', [id]),
    getAll: () => db.query('SELECT * FROM "session"'),
    getSessionBySocket: (socket) => db.query('SELECT "session"."sessionID", "presentation"."userID", "presentation"."title" FROM "session" INNER JOIN "presentation" ON "presentation"."presentationID" = "session"."presentationID" WHERE "socket" = $1', [socket]),
    post: (presentationID, socket) => db.query('INSERT INTO "session" ("presentationID", "socket") VALUES ($1, $2) RETURNING "sessionID"', [presentationID, socket])
  },
  response: {
    truncate: () => db.query('DELETE FROM "response" where "responseID" >= 0'),
    get: (id) => db.query('SELECT * FROM "response" WHERE "responseID" = $1', [id]),
    getResponseByQ: (qid) => db.query('SELECT * FROM "response" WHERE "questionID" = $1', [qid]),
    getResponseByS: (sessionID) => db.query('SELECT * FROM "response" WHERE "sessionID" = $1', [sessionID]),
    getResponseByQS: (qid, sessionID) => db.query('SELECT * FROM "response" WHERE "questionID" = $1 AND "sessionID" = $2', [qid, sessionID]),
    post: (sessionID, userID, questionID, answerID, content) => db.query('INSERT INTO "response" ("sessionID", "userID", "questionID", "answerID", "content") VALUES ($1, $2, $3, $4, $5) RETURNING "responseID"', [sessionID, userID, questionID, answerID, content]),
    postMultiple: (values) => db.query('INSERT INTO "response" ("sessionID", "userID", "questionID", "answerID", "content") VALUES' + values + ' RETURNING "responseID"'),
  }
}