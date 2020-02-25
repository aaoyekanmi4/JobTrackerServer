CREATE TABLE contacts (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT, 
    contact_url TEXT, 
    last_contacted DATE,
    date_created TIMESTAMP DEFAULT now() NOT NULL,
    user_id INTEGER
        REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    job_id INTEGER
        REFERENCES jobs(id) ON DELETE CASCADE NOT NULL
   
);
