CREATE TABLE images (
    id SERIAL PRIMARY KEY,
    image_name VARCHAR(255),
    image_data BYTEA,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);