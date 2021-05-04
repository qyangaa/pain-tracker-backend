CREATE DATABASE pain_tracker;
--start sudo -i -u postgres
-- psql
--\c pain_tracker
-- \dt show tables
-- Create categories table
-- http://127.0.0.1/pgadmin4/browser/#
CREATE TABLE categories(
    category_id SERIAL PRIMARY KEY,
    short_name VARCHAR(20) NOT NULL,
    title VARCHAR(255) NOT NULL,
    screen_type TEXT NOT NULL,
    has_duration BOOLEAN NOT NULL,
    background_image TEXT NOT NULL
);

-- import data to table from csv file
COPY categories(short_name, title, screen_type, has_duration, background_image)
FROM '/home/arkyyang/files/webdev/pain-tracker/pain-tracker-backend/tempData/categories.csv'
DELIMITER ','
CSV HEADER;

SELECT * FROM categories;


-- Create icons table
CREATE TABLE icons(
    icon_id SERIAL PRIMARY KEY,
    svg TEXT NOT NULL
)
FROM '/home/arkyyang/files/webdev/pain-tracker/pain-tracker-backend/tempData/icons.csv'
DELIMITER ','
CSV HEADER;

-- Create options table
CREATE TABLE options(
    option_id SERIAL PRIMARY KEY,
    category_id INTEGER REFERENCES categories(category_id) NOT NULL,
    title VARCHAR(40) NOT NULL,
    duration INTEGER,
    amount REAL,
    icon_name VARCHAR(40)
);

COPY options(category_id, title, src, src_active, duration, amount)
FROM '/home/arkyyang/files/webdev/pain-tracker/pain-tracker-backend/tempData/options.csv'
DELIMITER ','
CSV HEADER;

INSERT INTO options (category_id, title) VALUES (1, 'better');
INSERT INTO options (category_id, title) VALUES (1, 'worse');


-- Create User Table
CREATE TABLE users(
    user_id SERIAL PRIMARY KEY,
    auth_id VARCHAR(50) NOT NULL,
    condition VARCHAR[][],
    birthdate DATE,
    gender VARCHAR(20)
);

INSERT INTO users (auth_id) VALUES ('dummyAuthId');

-- Create and populate last_useds table
CREATE TABLE last_useds(
    user_id SERIAL PRIMARY KEY,
    CONSTRAINT fk_user
        FOREIGN KEY(user_id)
            REFERENCES users(user_id),
    options INTEGER[] NOT NULL,
    selected BOOLEAN[] NOT NULL,
    duration INTEGER[],
    amount REAL[]
);

INSERT INTO last_useds(user_id, options, selected, duration) VALUES (1, '{16, 17, 18, 19, 20, 21, 22, 23, 24, 25}', '{TRUE, FALSE, TRUE, FALSE, FALSE, TRUE, TRUE, FALSE, FALSE, FALSE}', '{0, 0, 0, 0, 0, 0, 22, 30, 0, 0}');



-- create weather table
CREATE TABLE weathers(
    weather_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(user_id) NOT NULL,
    date_ Date NOT NULL,
    lon REAL NOT NULL,
    lat REAL NOT NULL,
    main VARCHAR(256) NOT NULL,
    description_ TEXT NOT NULL,
    temp INTEGER NOT NULL,
    humidity INTEGER NOT NULL,
    pressure INTEGER NOT NULL,
    clouds INTEGER NOT NULL,
    visibility INTEGER NOT NULL,
    wind_speed INTEGER NOT NULL
);

INSERT INTO weathers(
    user_id,
    date_,
    lon ,
    lat,
    main,
    description_,
    temp,
    humidity ,
    pressure ,
    clouds,
    visibility,
    wind_speed) VALUES (
        1,
        '2021-03-28',
        -121.9808,
        37.5502,
        'Clear',
        'clear sky',
        289,
        45,
        1024,
        1,
        10000,
        4
    );

-- create records table
CREATE TABLE records(
    record_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(user_id),
    option_id INTEGER REFERENCES options(option_id) NOT NULL,
    category_id INTEGER REFERENCES categories(category_id) NOT NULL,
    duration INTEGER,
);



-- Put icons into options
SELECT p.option_id AS _id, 
p.category_id AS "categoryId", 
p.title, 
p.duration, 
p.amount,
i_src.svg AS src,
i_src_active as "srcActive"
FROM options p 
LEFT OUTER JOIN icons i_src on p.src = i_src.icon_id
LEFT OUTER JOIN icons i_src_active on p.src_active = i_src_active.icon_id
WHERE p.option_id = ANY($1::int[])
;


-- Commonly used
-- Batch select: 
select * from word_weight where word in ('a', 'steeple', 'the');
-- rename column
ALTER TABLE weathers 
RENAME COLUMN lag TO lat;

-- Full text search -------------------
SELECT title FROM options where to_tsvector(title) @@ to_tsquery('swim');

-- triger for indexing when adding new items
CREATE FUNCTION option_tsvector_trigger() RETURNS trigger AS $$
BEGIN
    new.vector_field = to_tsvector('english', coalesce(new.title, ''));
    return new;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tsvectorupdate_options BEFORE INSERT OR UPDATE ON options FOR EACH ROW EXECUTE PROCEDURE option_tsvector_trigger();

-- create ts column and index
ALTER TABLE options
    ADD COLUMN vector_field tsvector;
UPDATE options
set vector_field = to_tsvector(coalesce(title, ''));

CREATE INDEX vector_field_idx
    ON options
    USING GIN (vector_field);

-- query
explain ANALYZE
SELECT title FROM options where  vector_field @@ to_tsquery('swim');

-- Remove all trailing spaces
update categories set background_image = ltrim (background_image) where background_image LIKE ' %';
update categories set short_name = ltrim (short_name) where short_name LIKE ' %';
update categories set screen_type = ltrim (screen_type) where screen_type LIKE ' %';
update categories set title = ltrim (title) where title LIKE ' %';


update options set title = ltrim (title) where title LIKE ' %';
update icons set svg = ltrim (svg) where svg LIKE ' %';

    option_id SERIAL PRIMARY KEY,
    category_id INTEGER REFERENCES categories(category_id) NOT NULL,
    title VARCHAR(40) NOT NULL,
    duration INTEGER,
    amount REAL,

update options set icon_name = 'swim' Where title = 'swimming';
update options set icon_name = 'yoga' Where title = 'yoga';
update options set icon_name = 'weight' Where title = 'weight';
update options set icon_name = 'hiking' Where title = 'hiking';
update options set icon_name = 'anxiety' Where title = 'anxious';
update options set icon_name = 'happy' Where title = 'happy';
update options set icon_name = 'sad' Where title = 'sad';
update options set icon_name = 'peaceful' Where title = 'peaceful';


update options set icon_name = 'heart_broken' Where title = 'worse';
update options set icon_name = 'heart' Where title = 'better';
'running'
'pole dancing'
'hot yoga'
'boxing'
'bicycle'


INSERT INTO options (category_id, title, icon_name) VALUES (3, 'running', 'running');
INSERT INTO options (category_id, title, icon_name) VALUES (3, 'pole dancing', 'pole%20dancing');
INSERT INTO options (category_id, title, icon_name) VALUES (3, 'hot yoga', 'hot%20yoga');
INSERT INTO options (category_id, title, icon_name) VALUES (3, 'boxing', 'boxing');
INSERT INTO options (category_id, title, icon_name) VALUES (3, 'biking', 'bicycle');

update categories set has_duration = true  Where category_id = 3;


-- Records query

SELECT *
FROM records
WHERE user_id = 2
AND date >=CURRENT_DATE - INTERVAL '1 month'
ORDER BY date ASC;