-- ---
-- Globals
-- ---

-- SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";
-- SET FOREIGN_KEY_CHECKS=0;

DROP TABLE IF EXISTS "response" CASCADE;
DROP TABLE IF EXISTS "session" CASCADE;
DROP TABLE IF EXISTS "answer" CASCADE;
DROP TABLE IF EXISTS "question" CASCADE;
DROP TABLE IF EXISTS "presentation" CASCADE;
DROP TABLE IF EXISTS "user" CASCADE;
DROP TABLE IF EXISTS "audQuestion" CASCADE;
DROP TABLE IF EXISTS "participant" CASCADE;

-- ---
-- Table 'user'
--
-- ---

DROP TABLE IF EXISTS "user";

CREATE TABLE "user" (
  "userID" SERIAL NOT NULL,
  "type" INTEGER NOT NULL DEFAULT 1,
  "firstName" VARCHAR(30) NOT NULL,
  "lastName" VARCHAR(50) NOT NULL,
  "email" VARCHAR(100) NOT NULL,
  "password" VARCHAR(50) NOT NULL,
  "authID" VARCHAR(150) NULL DEFAULT NULL,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY ("userID")
);

-- ---
-- Table 'presentation'
--
-- ---

DROP TABLE IF EXISTS "presentation";

CREATE TABLE "presentation" (
  "presentationID" SERIAL NOT NULL,
  "userID" INTEGER NOT NULL DEFAULT -1,
  "title" VARCHAR(100) NOT NULL,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY ("presentationID")
);

-- ---
-- Table 'questionID'
--
-- ---

DROP TABLE IF EXISTS "question";

CREATE TABLE "question" (
  "questionID" SERIAL NOT NULL,
  "presentationID" INTEGER NOT NULL DEFAULT -1,
  "type" INTEGER NOT NULL DEFAULT 0,
  "question" VARCHAR(140) NULL DEFAULT NULL,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY ("questionID")
);

-- ---
-- Table 'answer'
--
-- ---

DROP TABLE IF EXISTS "answer";

CREATE TABLE "answer" (
  "answerID" SERIAL NOT NULL,
  "questionID" INTEGER NOT NULL DEFAULT -1,
  "answer" VARCHAR(140) NULL DEFAULT NULL,
  "correct" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY ("answerID")
);

-- ---
-- Table 'session'
--
-- ---

DROP TABLE IF EXISTS "session";

CREATE TABLE "session" (
  "sessionID" SERIAL NOT NULL,
  "presentationID" INTEGER NOT NULL DEFAULT -1,
  "socket" VARCHAR(8) NOT NULL,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY ("sessionID")
);

-- ---
-- Table 'response'
--
-- ---

DROP TABLE IF EXISTS "response";

CREATE TABLE "response" (
  "responseID" SERIAL NOT NULL,
  "sessionID" INTEGER NOT NULL DEFAULT -1,
  "userID" INTEGER NOT NULL DEFAULT -1,
  "questionID" INTEGER NOT NULL DEFAULT -1,
  "answerID" INTEGER NOT NULL DEFAULT -1,
  "content" VARCHAR(255) NULL DEFAULT NULL,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY ("responseID")
);

-- ---
-- Table 'audquestion'
--
-- ---

DROP TABLE IF EXISTS "audQuestion";

CREATE TABLE "audQuestion" (
  "audQuestionID" SERIAL NOT NULL,
  "sessionID" INTEGER NOT NULL DEFAULT -1,
  "userID" INTEGER NOT NULL DEFAULT -1,
  "content" VARCHAR(255) NULL DEFAULT NULL,
  "upvotes" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY ("audQuestionID")
);

-- ---
-- Table 'participant'
--
-- ---

DROP TABLE IF EXISTS "participant";

CREATE TABLE "participant" (
  "participantID" SERIAL NOT NULL,
  "userID" INTEGER NOT NULL DEFAULT -1,
  "sessionID" INTEGER NOT NULL DEFAULT -1,
  PRIMARY KEY ("participantID")
);

-- ---
-- Table 'group'
--
-- ---

DROP TABLE IF EXISTS "group";

CREATE TABLE "group" (
  "groupID" SERIAL NOT NULL,
  "name" VARCHAR(255) NULL DEFAULT NULL,
  "userID" INTEGER NOT NULL DEFAULT -1,
  PRIMARY KEY ("groupID")
);

-- ---
-- Table 'groupMember'
--
-- ---

DROP TABLE IF EXISTS "groupMember";

CREATE TABLE "groupMember" (
  "groupMemberID" SERIAL NOT NULL,
  "groupID" INTEGER NOT NULL DEFAULT -1,
  "userID" INTEGER NOT NULL DEFAULT -1,
  PRIMARY KEY ("groupID")
);

-- ---
-- Foreign Keys
-- ---

ALTER TABLE "presentation" ADD FOREIGN KEY ("userID") REFERENCES "user" ("userID") ON DELETE CASCADE;
ALTER TABLE "question" ADD FOREIGN KEY ("presentationID") REFERENCES "presentation" ("presentationID") ON DELETE CASCADE;
ALTER TABLE "answer" ADD FOREIGN KEY ("questionID") REFERENCES "question" ("questionID") ON DELETE CASCADE;
ALTER TABLE "session" ADD FOREIGN KEY ("presentationID") REFERENCES "presentation" ("presentationID") ON DELETE CASCADE;
ALTER TABLE "response" ADD FOREIGN KEY ("sessionID") REFERENCES "session" ("sessionID") ON DELETE CASCADE;
ALTER TABLE "response" ADD FOREIGN KEY ("userID") REFERENCES "user" ("userID") ON DELETE CASCADE;
ALTER TABLE "response" ADD FOREIGN KEY ("questionID") REFERENCES "question" ("questionID") ON DELETE CASCADE;
ALTER TABLE "response" ADD FOREIGN KEY ("answerID") REFERENCES "answer" ("answerID") ON DELETE CASCADE;
ALTER TABLE "audQuestion" ADD FOREIGN KEY ("userID") REFERENCES "user" ("userID") ON DELETE CASCADE;
ALTER TABLE "audQuestion" ADD FOREIGN KEY ("sessionID") REFERENCES "session" ("sessionID") ON DELETE CASCADE;
ALTER TABLE "participant" ADD FOREIGN KEY ("userID") REFERENCES "user" ("userID") ON DELETE CASCADE;
ALTER TABLE "participant" ADD FOREIGN KEY ("sessionID") REFERENCES "session" ("sessionID") ON DELETE CASCADE;
ALTER TABLE "group" ADD FOREIGN KEY ("userID") REFERENCES "user" ("userID") ON DELETE CASCADE;
ALTER TABLE "groupMember" ADD FOREIGN KEY ("groupID") REFERENCES "group" ("groupID") ON DELETE CASCADE;
ALTER TABLE "groupMember" ADD FOREIGN KEY ("userID") REFERENCES "user" ("userID") ON DELETE CASCADE;
-- ---
-- Table Properties
-- ---

-- ALTER TABLE "user" ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
-- ALTER TABLE "presentation" ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
-- ALTER TABLE "questions" ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
-- ALTER TABLE "questionID" ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
-- ALTER TABLE "answer" ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
-- ALTER TABLE "session" ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
-- ALTER TABLE "response" ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- ---
-- Test Data
-- ---


INSERT INTO "user" ("userID","type","firstName","lastName","email","password","authID") VALUES
(-1,0,'undefined','undefined','undefined','undefined','undefined');
INSERT INTO "presentation" ("presentationID", "title", "userID") VALUES
(-1, 'undefined', -1);
INSERT INTO "question" ("questionID","presentationID","type","question") VALUES
(-1,-1,0,'undefined');
INSERT INTO "answer" ("answerID","questionID","answer","correct") VALUES
(-1,-1,'undefined',0);
INSERT INTO "session" ("sessionID","presentationID","socket") VALUES
(-1,-1,'null');
INSERT INTO "response" ("responseID","sessionID","userID","questionID","answerID","content") VALUES
(-1,-1,-1,-1,-1,null);
INSERT INTO "audQuestion" ("audQuestionID", "userID", "content", "upvotes") VALUES
(-1, -1, 'undefined', 0);
INSERT INTO "participant" ("participantID", "userID", "sessionID") VALUES
(-1, -1, -1);
INSERT INTO "group" ("groupID", "name", "userID") VALUES
(-1, 'undefined', -1);
INSERT INTO "groupMember" ("groupMemberID", "groupID", "userID") VALUES
(-1, -1, -1);
