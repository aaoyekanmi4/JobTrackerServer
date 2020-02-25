CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  user_name TEXT NOT NULL UNIQUE,
  email TEXT,
  password TEXT NOT NULL,
  date_created TIMESTAMP NOT NULL DEFAULT now()
);
ALTER TABLE jobs
  ADD COLUMN
    user_id INTEGER REFERENCES users(id)
    ON DELETE SET NULL;
