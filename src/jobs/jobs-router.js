const express = require("express");
const jobsRouter = express.Router();
const xss = require('xss')
const bodyParser = express.json();
const { requireAuth } = require('../middleware/jwt-auth')
const jobsService = require("./jobs-service");

jobsRouter
  .route("/api/jobs")
  .all(requireAuth)
  .get((req, res, next) => {
    const knexInstance = req.app.get("db");
    jobsService
      .getUsersJobs(knexInstance, req.user.id)
      .then(jobs => {
      res.json(  jobs.map(job => ({  id: job.id,
        company: xss(job.company),
        job_role: xss(job.job_role),
        job_location: xss(job.job_location),
        job_description:xss(job.job_description),
        found_at: xss(job.found_at) || null,
        applied: xss(job.applied) || null,
        phone_screen: xss(job.phone_screen) || null,
        interview: xss(job.interview) || null,
        offer: xss(job.offer) || null,
        date_created: job.date_created,
        user_id:job.user_id}))
      )
      })
      .catch(next);
  })
  .post(bodyParser, (req, res, next) => {
    const { company, job_role, job_location, job_description, found_at, applied, phone_screen, interview, offer} = req.body;

    const requiredValues = { company, job_role, job_location}

    for (const [key, value] of Object.entries(requiredValues)) {
      if (value == null) {
        return res.status(400).json({
          error: `Missing required value: ${key}` }
        );
      }
    }
    const newJob = { company, job_role, job_location, job_description, found_at,applied, phone_screen, interview, offer };
    newJob.user_id = req.user.id;
    jobsService
      .insertJob(req.app.get("db"), newJob)
      .then(job => {
        res
          .status(201)
          .location(`/api/jobs/${job.id}`)
          .json( {
            id: job.id,
            company: xss(job.company),
            job_role: xss(job.job_role),
            job_location: xss(job.job_location),
            job_description:xss(job.job_description),
            found_at: xss(job.found_at),
            applied: xss(job.applied) || null,
            phone_screen: xss(job.phone_screen) || null,
            interview: xss(job.interview) || null,
            offer: xss(job.offer) || null,
            date_created: job.date_created.toISOString(),
            user_id:job.user_id
        
          });
      })
      .catch(next);
  });

jobsRouter.route("/api/jobs/:job_id")
   .all(requireAuth, (req, res, next) => {
       jobsService.getJobById(
         req.app.get('db'),
         req.params.job_id,
         req.user.id
       )
         .then(job => {
           if (!job) {
             return res.status(404).json({
               error:`Job doesn't exist` 
             })
           }
           res.job = job // save the job for the next middleware
           next() // don't forget to call next so the next middleware happens!
         })
         .catch(next)
     })
     .get((req, res, next) => {
           res.json( {
            id: res.job.id,
            company: xss(res.job.company),
            job_role: xss(res.job.job_role),
            job_location: xss(res.job.job_location) || null,
            job_description:xss(res.job.job_description),
            found_at: xss(res.job.found_at) || null,
            applied: xss(res.job.applied) || null,
            phone_screen: xss(res.job.phone_screen) || null,
            interview: xss(res.job.interview) || null,
            offer: xss(res.job.offer) || null,
            date_created: res.job.date_created,
            user_id:res.job.user_id
        
          });
              })
              .delete((req, res, next) => {
            
                   jobsService.deleteJob(
                     req.app.get('db'),
                     req.params.job_id,
                     req.user.id
                   )
                     .then(() => {
                       res.status(204).end()
                     })
                     .catch(next)
                  })
                
 .patch( bodyParser, (req, res, next) => {
  const { company, job_role, job_location, job_description, found_at, applied, phone_screen, interview, offer} = req.body;

  const requiredValues = { company, job_role, job_location}

  for (const [key, value] of Object.entries(requiredValues)) {
    if (value == null) {
      return res.status(400).json({
        error: `Missing required value: '${key}'` }
      );
    }
  }

     const jobToUpdate = { company, job_role, job_location, job_description, found_at,applied, phone_screen, interview, offer };

 
jobsService
.updateJob( req.app.get('db'),
       req.params.job_id,
       jobToUpdate,
       req.user.id
     )
       .then(numRowsAffected => {
         res.status(204).end()
     
       })
       .catch(next)
    })
module.exports = jobsRouter;
