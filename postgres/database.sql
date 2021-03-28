CREATE DATABASE pain_tracker;

--\c into pain_tracker
-- \dt show tables
-- Create categories table
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
CREATE TABLE icons(options INTEGER[] NOT NULL,
    selected BOOLEAN[] NOT NULL,
    duration INTEGER[],
    amount REAL[]
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
    src INTEGER REFERENCES icons(icon_id),
    src_active INTEGER REFERENCES icons(icon_id)
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
    lag REAL NOT NULL,
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
    lag,
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
    amount REAL
);


-- Commonly used
-- Batch select: 
select * from word_weight where word in ('a', 'steeple', 'the');