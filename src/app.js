require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const { NODE_ENV } = require('./config')
const jobsService = require('./jobs-service');
const app = express()

const morganOption = (NODE_ENV === 'production')
  ? 'tiny'
  : 'common';

app.use(morgan(morganOption))
app.use(helmet())
app.use(cors())
//send all jobs
 app.get('/api/jobs', (req, res, next) => {
  const knexInstance = req.app.get('db')
  jobsService.getAllJobs(knexInstance)
      .then(jobs => {
               res.json(jobs)
      })
      .catch(next)
  })
  app.get('/api/jobs/:job_id', (req, res, next) => {
    const knexInstance = req.app.get('db');
    const jobId = req.params.job_id;
    jobsService.getJobById(knexInstance, jobId )
    .then (job => res.json(job))

  .catch(next)
  })
  
  


      app.use(function errorHandler(error, req, res, next) {
           let response
           if (NODE_ENV === 'production') {
             response = { error: { message: 'server error' } }
           } else {
             console.error(error)
             response = { message: error.message, error }
           }
           res.status(500).json(response)
         })

module.exports = app