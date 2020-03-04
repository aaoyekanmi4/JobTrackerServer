# Job Tracker Server

## Summary 

API for the Job Tracker App. Job Tracker is a full stack application that helps users 
store data on their job search. Users must be logged in to access each of the endpoints. 


## Tech: PostgreSQL, Knex, Express, Node, Mocha, Chai, bcrypt, jwt

Client: https://github.com/aaoyekanmi4/JobTrackerServer 

## Endpoints

### Jobs

 * /api/jobs
   * GET all jobs for a specific user
   * POST add job to database from client
   
 * /api/jobs/:job_id 
   * GET job by id
   * PATCH edit job at id
   * DELETE delete job from database
   
### Contacts

 * /api/contacts/job/:job_id 
   * GET contacts all contacts with job_id
   * POST add contact to database for a specific job
   
 * /api/contacts/:contact_id
   * GET contact by id
   * PATCH edit contact at id
   * DELETE delete contact at id
   
### Users 

 * /api/users
   * POST register a user and add to database
   
### Auth 

 * /api/auth/login
   * POST login user and return token
 
   

 
