var db = require('./index');
var Promise = require('bluebird');



module.exports = {
  user: {
    truncate: () => db.query('DELETE FROM "user" where "userID" >= 0'),
    get: (id) => db.query('SELECT * FROM "user" where "userID" = $1', [id]),
    getAll: () => db.query('SELECT * FROM "user"'),
    search: (search) => db.query('SELECT * FROM "user" where lower("firstName") LIKE $1 OR lower("lastName") LIKE $1 OR lower(concat("firstName", \' \', "lastName")) LIKE $1', ['%' + search.toLowerCase() + '%']),
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
    put: (title, pid) => db.query('UPDATE "presentation" SET "title" = $1 WHERE "presentationID" = $2', [title, pid]),
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
    put: (answer, correct, id) => db.query('UPDATE "answer" SET "answer" = $1, "correct" = $2 WHERE "answerID" = $3', [answer, correct, id]),
    delete: (id) => db.query('DELETE FROM "answer" WHERE "answerID" IN ' + id),
  },
  session: {
    truncate: () => db.query('DELETE FROM "session" where "sessionID" >= 0'),
    get: (id) => db.query('SELECT * FROM "session" WHERE "sessionID" = $1', [id]),
    getAll: () => db.query('SELECT * FROM "session"'),
    getLastID: (userID) => db.query('SELECT s."sessionID" FROM "session" s INNER JOIN "presentation" p ON s."presentationID" = p."presentationID" AND p."userID" = $1 ORDER BY s."updatedAt" DESC LIMIT 1', [userID]),
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
  },
  audQuestion: {
    truncate: () => db.query('DELETE FROM "audQuestion" where "audQuestionID" >= 0'),
    get: id => db.query('SELECT * FROM "audQuestion" WHERE "audQuestionID" = $1', [id]),
    getAudQuestionByS: sessionID => db.query('SELECT * FROM "audQuestion" WHERE "sessionID" = $1', [sessionID]),
    post: (sessionID, userID, content) => db.query('INSERT INTO "audQuestion" ("sessionID", "userID", "content") VALUES ($1, $2, $3) RETURNING "audQuestionID"', [sessionID, userID, content]),
    put: aqid => db.query('UPDATE "audQuestion" SET "upvotes" = "upvotes" + 1 WHERE "audQuestionID" = $1 RETURNING "audQuestionID"', [aqid])
  },
  participant: {
    post: (userID, sessionID) => db.query('INSERT INTO "participant" ("userID", "sessionID") VALUES ($1, $2) RETURNING "participantID"', [userID, sessionID]),
    get: id => db.query('SELECT * FROM "participant" WHERE "participantID" = $1', [id]),
    getBySession: sessionID => db.query('SELECT * FROM "participant" WHERE "sessionID" = $1', [sessionID]),
    getByUser: userID => db.query('SELECT * FROM "participant" WHERE "userID" = $1', [userID])
  },
  group: {
    post: (name, userID) => db.query('INSERT INTO "group" ("name", "userID") VALUES ($1, $2) RETURNING "groupID"', [name, userID]),
    get: id => db.query('SELECT * FROM "group" WHERE "groupID" = $1', [id]),
    getLastID: userID => db.query('SELECT "groupID" FROM "group" WHERE "userID" = $1 ORDER BY "updatedAt" DESC LIMIT 1', [userID]),
    put: (name, groupID) => db.query('UPDATE "group" SET "name" = $1 WHERE "groupID" = $2', [name, groupID]),
    getByUser: userID => db.query('SELECT * FROM "group" WHERE "userID" = $1', [userID]),
    delete: id => db.query('DELETE FROM "group" WHERE "groupID" = $1', [id])
  },
  groupMember: {
    post: (groupID, userID) => db.query('INSERT INTO "groupMember" ("groupID", "userID") VALUES ($1, $2) RETURNING "groupMemberID"', [groupID, userID]),
    get: id => db.query('SELECT * FROM "groupMember" WHERE "groupMemberID" = $1', [id]),
    getByGroup: groupID => db.query('SELECT gm.*, u."firstName", u."lastName", u."email" FROM "groupMember" gm INNER JOIN "user" u ON u."userID" = gm."userID" WHERE "groupID" = $1', [groupID]),
    delete: (groupID, userID) => db.query('DELETE FROM "groupMember" WHERE "groupID" = $1 AND "userID" = $2', [groupID, userID])
  }

}
