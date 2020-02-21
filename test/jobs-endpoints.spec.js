const { expect } = require('chai')
const knex = require('knex')
const app = require('../src/app');

describe('Jobs Endpoints', function() {
  let db;
  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DB_URL,
    })
    app.set('db', db)
  })

  after('disconnect from db', () => db.destroy())

  before('clean the table', () => db('jobs').truncate())
  afterEach('cleanup', () => db('jobs').truncate())
     context('Given there are jobs in the database', () => {
         const testJobs = [
          {
            id: 1,
            company: 'Appy',
            job_role: 'Programmer',
            job_location: null,
            job_description: 'I program the computers.',
            found_at: null,
            applied: null,
            phone_screen: null,
            interview: null,
            offer: null,
            date_created: null
          },
          {
            id: 2,
            company: 'MIB',
            job_role: 'Code Ninja',
            job_location: null,
            job_description: 'Hiyaaaa!',
            found_at: null,
            applied: null,
            phone_screen: null,
            interview: null,
            offer: null,
            date_created: null
          },
          {
            id: 3,
            company: 'The Space Force',
            job_role: 'Super Secret Role',
            job_location: null,
            job_description: 'Confidential and Secret',
            found_at: null,
            applied: null,
            phone_screen: null,
            interview: null,
            offer: null,
            date_created: null
          }
        ];
    
         beforeEach('insert jobs', () => {
           return db
             .into('jobs')
             .insert(testJobs)
         })
   
          it('GET /api/jobs responds with 200 and all of the jobs', () => {
             return supertest(app)
               .get('/api/jobs')
               .expect(200, testJobs)
           })
              it('GET /api/jobs/:job_id responds with 200 and the specified job', () => {
                 const jobId = 2
                 const expectedJob = testJobs[jobId - 1]
                 return supertest(app)
                   .get(`/api/jobs/${jobId}`)
                   .expect(200, expectedJob)
               })

})
})