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
    post: (userID) => db.query('INSERT INTO "presentation" ("userID") VALUES ($1) RETURNING "presentationID"', [userID])
  },
  question: {
    truncate: () => db.query('DELETE FROM "question" where "questionID" >= 0'),
    get: (id) => db.query('SELECT * FROM "question" WHERE "questionID" = $1', [id]),
    getAll: () => db.query('SELECT * FROM "question"'),
    getQuestionsBySocket: (socket) =>
      db.query('SELECT DISTINCT "questionID", "question" FROM "question" INNER JOIN "session" ON "session"."presentationID" = "question"."presentationID" AND "session"."socket" = $1', [socket]),
    getQuestionsByPresentation: (presentationID) =>
      db.query('SELECT * FROM "question" WHERE "presentationID" = $1', [presentationID]),
<<<<<<< ae1d2f4ceb46e08ea8b946cbe774cb22609b99a6
    post: (presentationID, type, question) => db.query('INSERT INTO "question" ("presentationID", "type", "question") VALUES ($1, $2, $3) RETURNING "questionID"', [presentationID, type, question])
=======
    post: (presentationID, type, question) => db.query('INSERT INTO "question" ("presentationID", "type", "question") VALUES ($1, $2, $3) RETURNING "questionID"', [presentationID, type, question]),
    put: (presentationiD, type, question, qid) => db.query('UPDATE "question" SET "presentationID" = $1, "type" = $2, "question" = $3 WHERE "questionID" = $4', [presentationID, type, question, qid]),
>>>>>>> (feat) add update/delete queries for answer
  },
  answer: {
    truncate: () => db.query('DELETE FROM "answer" where "answerID" >= 0'),
    get: (id) => db.query('SELECT * FROM "answer" WHERE "answerID" = $1', [id]),
<<<<<<< ae1d2f4ceb46e08ea8b946cbe774cb22609b99a6
    getAnswerByQuestion: (id) => db.query('SELECT * FROM "answer" WHERE "questionID" = $1', [id]),
    getCorrect: (id) => db.query('SELECT * FROM "answer" WHERE "questionID" = $1 AND "correct" = $2', [id, 1]),
    post: (questionID, answer, correct) => db.query('INSERT INTO "answer" ("questionID", "answer", "correct") VALUES ($1, $2, $3) RETURNING "answerID"', [questionID, answer, correct]),
    postMultiple: (values) => db.query('INSERT INTO "answer" ("questionID", "answer", "correct") VALUES ' + values)
=======
    getAll: () => db.query('SELECT * FROM "answer"'),
    getAnswerByQuestion: (id) => db.query('SELECT * FROM "answer" WHERE "questionID" = $1', [id]),
    getCorrect: (id) => db.query('SELECT * FROM "answer" WHERE "questionID" = $1 AND "correct" = $2', [id, 1]),
    post: (questionID, answer, correct) => db.query('INSERT INTO "answer" ("questionID", "answer", "correct") VALUES ($1, $2, $3) RETURNING "answerID"', [questionID, answer, correct]),
    postMultiple: (values) => db.query('INSERT INTO "answer" ("questionID", "answer", "correct") VALUES ' + values),
    update: (questionID, answer, correct, id) => db.query('UPDATE "answer" SET "questionID" = $1, "answer" = $2, "correct" = $3 WHERE "answerID" = $4', [questionID, answer, correct, id]),
    delete: (id) => db.query('DELETE FROM "answer" WHERE "answerID" = $1', [id])
>>>>>>> (feat) add update/delete queries for answer
  },
  session: {
    truncate: () => db.query('DELETE FROM "session" where "sessionID" >= 0'),
    get: (id) => db.query('SELECT * FROM "session" WHERE "sessionID" = $1', [id]),
    getAll: () => db.query('SELECT * FROM "session"'),
    getSessionBySocket: (socket) => db.query('SELECT "session"."sessionID", "presentation"."userID" FROM "session" INNER JOIN "presentation" ON "presentation"."presentationID" = "session"."presentationID" WHERE "socket" = $1', [socket]),
    post: (presentationID, socket) => db.query('INSERT INTO "session" ("presentationID", "socket") VALUES ($1, $2) RETURNING "sessionID"', [presentationID, socket])
  },
  response: {
    truncate: () => db.query('DELETE FROM "response" where "responseID" >= 0'),
    get: (id) => db.query('SELECT * FROM "response" WHERE "responseID" = $1', [id]),
    getResponseByQ: (qid) => db.query('SELECT * FROM "response" WHERE "questionID" = $1', [qid]),
    getResponseByS: (sessionID) => db.query('SELECT * FROM "response" WHERE "sessionID" = $1', [sessionID]),
    getResponseByQS: (qid, sessionID) => db.query('SELECT * FROM "response" WHERE "questionID" = $1 AND "sessionID" = $2', [qid, sessionID]),
    post: (sessionID, userID, questionID, answerID, content) => db.query('INSERT INTO "response" ("sessionID", "userID", "questionID", "answerID", "content") VALUES ($1, $2, $3, $4, $5) RETURNING "responseID"', [sessionID, userID, questionID, answerID, content]),
    postMultiple: (values) => db.query('INSERT INTO "response" ("sessionID", "userID", "questionID", "answerID", "content") VALUES' + values),
  }
}