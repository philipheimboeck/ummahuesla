CREATE TABLE adjectives
(
    id integer NOT NULL,
    adjective_male text NOT NULL,
    adjective_female text NOT NULL,
    adjective_thing text NOT NULL
);

CREATE TABLE problems
(
    id integer NOT NULL,
    problem text NOT NULL
);

CREATE TABLE projects
(
    id integer NOT NULL,
    subject text NOT NULL,
    gender integer NOT NULL
);

CREATE TABLE objects
(
    id integer NOT NULL,
    name text NOT NULL
);
