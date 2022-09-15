DROP TABLE IF EXISTS "chat_per_owner" CASCADE;
DROP TABLE IF EXISTS "message" CASCADE;
DROP TABLE IF EXISTS "chat" CASCADE;
DROP TABLE IF EXISTS "helpdesker" CASCADE;

CREATE TABLE "helpdesker" (
  "id" uuid UNIQUE,
  "role" varchar(6) NOT NULL,
  "name" varchar(255) NOT NULL,
  "email" varchar(255) NOT NULL UNIQUE,
  "password" varchar(255) NOT NULL,
  "isAvailable" boolean NOT NULL,
  "created_at" timestamp NOT NULL,
  "updated_at" timestamp
);

CREATE TABLE "chat" (
  "id" uuid UNIQUE,
  "created_at" timestamp NOT NULL,
  "updated_at" timestamp
);

CREATE TABLE "message" (
  "id" uuid UNIQUE,
  "sender" varchar(255) NOT NULL,
  "receiver" varchar(255) NOT NULL,
  "chat_id" uuid NOT NULL REFERENCES chat (id) ON DELETE CASCADE ON UPDATE CASCADE,
  "text" varchar(1500) NOT NULL,
  "created_at" timestamp NOT NULL,
  "updated_at" timestamp
);

CREATE TABLE "chat_per_owner" (
  "chat_id" uuid NOT NULL REFERENCES chat (id) ON DELETE CASCADE ON UPDATE CASCADE,
  "owner_id" uuid NOT NULL REFERENCES helpdesker (id) ON DELETE CASCADE ON UPDATE CASCADE,
  "created_at" timestamp NOT NULL,
  "updated_at" timestamp
);

INSERT INTO "helpdesker" ("id", "role", "name", "email", "password", "isAvailable", "created_at") VALUES
('78d7685e-335d-11ed-a261-0242ac120002', 'helper', 'agent_one', 'agent_one@gmail.com', '$2a$12$in7pEyqd6yvGfzGj.8/MB.Kslv1x4tJLGMGQcLzbyrMEpnHswl4A.', 'true', '2022-09-12'),
('8560f778-335f-11ed-a261-0242ac120002', 'user', 'user_one', 'user_one@gmail.com', '$2a$12$in7pEyqd6yvGfzGj.8/MB.Kslv1x4tJLGMGQcLzbyrMEpnHswl4A.', 'true', '2022-09-13'),
('ad61df30-34c2-11ed-a261-0242ac120002', 'admin', 'admin_one', 'admin_one@gmail.com', '$2a$12$in7pEyqd6yvGfzGj.8/MB.Kslv1x4tJLGMGQcLzbyrMEpnHswl4A.', 'false', '2022-09-13');

INSERT INTO "chat" ("id", "created_at") VALUES
('b830c080-3363-11ed-a261-0242ac120002', '2022-09-13');

INSERT INTO "message" ("id", "sender", "receiver", "chat_id", "text", "created_at") VALUES
('8560fa34-335f-11ed-a261-0242ac120002', 'agent_one@gmail.com', 'user_one@gmail.com', 'b830c080-3363-11ed-a261-0242ac120002', 'Hello. How can I help you?', '2022-09-13'),
('8560fb74-335f-11ed-a261-0242ac120002', 'user_one@gmail.com', 'agent_one@gmail.com', 'b830c080-3363-11ed-a261-0242ac120002', 'Screen of my PC is black', '2022-09-13'),
('8560fe3a-335f-11ed-a261-0242ac120002', 'agent_one@gmail.com', 'user_one@gmail.com', 'b830c080-3363-11ed-a261-0242ac120002', 'Have you tried to turn it off and on again?', '2022-09-13'),
('b830bdba-3363-11ed-a261-0242ac120002', 'user_one@gmail.com', 'agent_one@gmail.com', 'b830c080-3363-11ed-a261-0242ac120002', 'Oh, working now, thanks.', '2022-09-13');

INSERT INTO "chat_per_owner" ("chat_id", "owner_id", "created_at") VALUES
('b830c080-3363-11ed-a261-0242ac120002', '78d7685e-335d-11ed-a261-0242ac120002', '2022-09-13'),
('b830c080-3363-11ed-a261-0242ac120002', '8560f778-335f-11ed-a261-0242ac120002', '2022-09-13');