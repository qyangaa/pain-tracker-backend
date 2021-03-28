CREATE DATABASE pain_tracker;

--\c into pain_tracker
CREATE TABLE categories(
    category_id SERIAL PRIMARY KEY,
    short_name VARCHAR(20) NOT NULL,
    title VARCHAR(255) NOT NULL,
    screen_type TEXT NOT NULL,
    has_duration BOOLEAN NOT NULL,
    background_image TEXT NOT NULL
);