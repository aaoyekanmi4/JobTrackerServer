CREATE TABLE jobs (
  id SERIAL PRIMARY KEY,
  company TEXT NOT NULL,
  job_role TEXT NOT NULL,
  job_location TEXT,
  job_description TEXT,
  found_at TEXT,
  applied BOOLEAN,
  phone_screen DATE,
  interview DATE,
  offer INTEGER,
  date_created TIMESTAMP DEFAULT now() 
);