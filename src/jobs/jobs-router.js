const express = require("express");
const jobsRouter = express.Router();
const xss = require('xss')
const bodyParser = express.json();
const jobsService = require("./jobs-service");

jobsRouter
  .route("/api/jobs")
  .get((req, res, next) => {
    const knexInstance = req.app.get("db");
    jobsService
      .getAllJobs(knexInstance)
      .then(jobs => {
        res.json(jobs);
      })
      .catch(next);
  })
  .post(bodyParser, (req, res, next) => {
    const { company, job_role, job_location, job_description, found_at, applied, phone_screen, interview, offer} = req.body;

    const requiredValues = { company, job_role, job_location, applied}

    for (const [key, value] of Object.entries(requiredValues)) {
      if (value == null) {
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body` }
        });
      }
    }
    const newJob = { company, job_role, job_location, job_description, found_at,applied, phone_screen, interview, offer };

    jobsService
      .insertJob(req.app.get("db"), newJob)
      .then(job => {
        res
          .status(201)
          .location(`/api/jobs/${job.id}`)
          .json(job);
      })
      .catch(next);
  });

jobsRouter.route("/api/jobs/:job_id").get((req, res, next) => {
  const knexInstance = req.app.get("db");
  const jobId = req.params.job_id;
  jobsService
    .getJobById(knexInstance, jobId)
    .then(job => {
      if (!job) {
        return res.status(404).json({
          error: { message: `Job doesn't exist` }
        });
      }

      res.json(job);
    })

    .catch(next);
});

module.exports = jobsRouter;
