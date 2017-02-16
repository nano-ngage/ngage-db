-- ---
-- Globals
-- ---

-- SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";
-- SET FOREIGN_KEY_CHECKS=0;

DROP TABLE IF EXISTS "response" CASCADE;
DROP TABLE IF EXISTS "session" CASCADE;
DROP TABLE IF EXISTS "answer" CASCADE;
DROP TABLE IF EXISTS "question" CASCADE;
DROP TABLE IF EXISTS "questions" CASCADE;
DROP TABLE IF EXISTS "presentation" CASCADE;
DROP TABLE IF EXISTS "user" CASCADE;
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
  "authID" INTEGER NULL DEFAULT -1,
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
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY ("presentationID")
);

-- ---
-- Table 'questions'
-- 
-- ---

DROP TABLE IF EXISTS "questions";
    
CREATE TABLE "questions" (
  "questionsID" SERIAL NOT NULL,
  "presentationID" INTEGER NOT NULL DEFAULT -1,
  "questionID" INTEGER NOT NULL DEFAULT -1,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY ("questionsID")
);

-- ---
-- Table 'questionID'
-- 
-- ---

DROP TABLE IF EXISTS "question";
    
CREATE TABLE "question" (
  "questionID" SERIAL NOT NULL,
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
-- Foreign Keys 
-- ---

ALTER TABLE "presentation" ADD FOREIGN KEY ("userID") REFERENCES "user" ("userID");
ALTER TABLE "questions" ADD FOREIGN KEY ("presentationID") REFERENCES "presentation" ("presentationID");
ALTER TABLE "questions" ADD FOREIGN KEY ("questionID") REFERENCES "question" ("questionID");
ALTER TABLE "answer" ADD FOREIGN KEY ("questionID") REFERENCES "question" ("questionID");
ALTER TABLE "session" ADD FOREIGN KEY ("presentationID") REFERENCES "presentation" ("presentationID");
ALTER TABLE "response" ADD FOREIGN KEY ("sessionID") REFERENCES "session" ("sessionID");
ALTER TABLE "response" ADD FOREIGN KEY ("userID") REFERENCES "user" ("userID");
ALTER TABLE "response" ADD FOREIGN KEY ("questionID") REFERENCES "question" ("questionID");
ALTER TABLE "response" ADD FOREIGN KEY ("answerID") REFERENCES "answer" ("answerID");


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
(-1,0,'undefined','undefined','undefined','undefined',0);
INSERT INTO "presentation" ("presentationID","userID") VALUES
(-1,-1);
INSERT INTO "question" ("questionID","type","question") VALUES
(-1,0,'undefined');
INSERT INTO "questions" ("questionsID","presentationID","questionID") VALUES
(-1,-1,-1);
INSERT INTO "answer" ("answerID","questionID","answer","correct") VALUES
(-1,-1,'undefined',0);
INSERT INTO "session" ("sessionID","presentationID","socket") VALUES
(-1,-1,'null');
INSERT INTO "response" ("responseID","sessionID","userID","questionID","answerID","content") VALUES
(-1,-1,-1,-1,-1,null);