const express = require('express')
const jobsRouter = express.Router()
const bodyParser = express.json()
const jobsService = require('./jobs-service')

jobsRouter
.route('/api/jobs')
.get ((req, res, next) => {
    const knexInstance = req.app.get('db')
    jobsService.getAllJobs(knexInstance)
        .then(jobs => {
                 res.json(jobs)
        })
        .catch(next)
    })

jobsRouter
.route('/api/jobs/:job_id') 
.get((req, res, next) => {
      const knexInstance = req.app.get('db');
      const jobId = req.params.job_id;
      jobsService.getJobById(knexInstance, jobId )
      .then (job => res.json(job))
  
    .catch(next)
    })

module.exports = jobsRouter;